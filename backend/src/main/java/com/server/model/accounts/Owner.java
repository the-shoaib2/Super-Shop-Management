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
import com.server.model.accounts.Website;

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
    @DBRef(lazy = true)
    private AccountSettings accountSettings;
    

    private String phone;


    private String address;

    private String description;

    private List<Website> websites = new ArrayList<>();

    // Auth fields
    private String refreshToken;
    private LocalDateTime lastLogin;
    
    // Profile fields
    private String avatarUrl;
    private boolean isActive;
    private boolean isVerified;
    private boolean isEmailVisible;
    private boolean isPhoneVisible;
    private String verificationToken;
    private LocalDateTime verificationExpiry;
    
    // Online status
    private boolean isOnline;
    private LocalDateTime lastActive;
    
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

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getDescription() {
        return description;
    }

    public List<Website> getWebsites() {
        return websites != null ? websites : new ArrayList<>();
    }
    
    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public boolean isEmailVisible() {
        return isEmailVisible;
    }

    public void setEmailVisible(boolean isEmailVisible) {
        this.isEmailVisible = isEmailVisible;
    }

    public boolean isPhoneVisible() {
        return isPhoneVisible;
    }

    public void setPhoneVisible(boolean isPhoneVisible) {
        this.isPhoneVisible = isPhoneVisible;
    }

    public boolean isOnline() {
        return isOnline;
    }

    public void setOnline(boolean isOnline) {
        this.isOnline = isOnline;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }
} 