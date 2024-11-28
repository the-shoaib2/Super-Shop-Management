package com.server.model.accounts;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.util.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import jakarta.persistence.PrePersist;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;

import com.server.model.store.Store;
import com.server.util.IdGenerator;

@Document(collection = "storeOwners")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Owner {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String ownerId; // OWN + numbers format
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    // Store References using DBRef for proper relationships
    @DBRef(lazy = true)
    private List<Store> stores = new ArrayList<>();
    
    // Current active store
    private String currentStoreId;
    
    // Account Settings
    @DBRef
    private AccountSettings accountSettings;
    
    // Auth fields
    private String refreshToken;
    private LocalDateTime lastLogin;
    
    // Profile fields
    private List<String> images;
    private boolean isActive;
    private boolean isVerified;
    private String verificationToken;
    private LocalDateTime verificationExpiry;
    
    // Audit fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    public static class AccountSettings {
        // General Settings
        private String timezone;
        private String dateFormat;
        private String currency;
        
        // Security Settings
        private boolean twoFactorEnabled;
        private String twoFactorMethod;
        private List<String> trustedDevices;
        
        // Notification Settings
        private boolean emailNotifications;
        private boolean pushNotifications;
        private boolean orderNotifications;
        private boolean marketingNotifications;
        
        // Appearance Settings
        private String theme;
        private String layout;
        private boolean compactMode;
        
        // Language & Region
        private String language;
        private String region;
        private String numberFormat;
        
        // Privacy Settings
        private boolean profileVisible;
        private boolean activityVisible;
        private boolean storeVisible;
        
        // Billing Settings
        private String billingEmail;
        private String billingAddress;
        private String taxId;
        private List<PaymentMethod> paymentMethods;
        
        // Integration Settings
        private Map<String, String> apiKeys;
        private List<String> connectedServices;
    }
    
    @Data
    public static class PaymentMethod {
        private String type;
        private String provider;
        private String accountNumber;
        private boolean isDefault;
        private LocalDateTime addedAt;
    }
    
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
            if (ownerId == null) {
                ownerId = IdGenerator.generateOwnerId();
            }
        }
        updatedAt = now;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public List<Store> getStores() {
        return stores != null ? stores : new ArrayList<>();
    }

    public void setStores(List<Store> stores) {
        this.stores = stores;
    }
} 