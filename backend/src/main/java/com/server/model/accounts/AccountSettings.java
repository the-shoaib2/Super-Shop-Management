package com.server.model.accounts;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "accountSettings")
public class AccountSettings {
    private String userId;
    private GeneralSettings general;
    private ProfileSettings profile;
    private SecuritySettings security;
    private NotificationSettings notifications;
    private AppearanceSettings appearance;
    private LanguageSettings language;
    private PrivacySettings privacy;
    private BillingSettings billing;
    private IntegrationSettings integrations;
    private LocalDateTime updatedAt;
    
    @Data
    public static class GeneralSettings {
        private String timezone;
        private String dateFormat;
        private String currency;
        private String language;
        private String region;
    }
    
    @Data
    public static class ProfileSettings {
        private String imageUrl;
        private String imageType;
        private Map<String, String> socialLinks;
        private boolean isPublic;
    }
    
    @Data
    public static class SecuritySettings {
        private boolean twoFactorEnabled;
        private String twoFactorMethod;
        private String backupEmail;
        private String backupPhone;
        private List<String> trustedDevices;
    }
    
    @Data
    public static class NotificationSettings {
        private boolean emailEnabled;
        private boolean pushEnabled;
        private boolean marketingEmails;
        private boolean orderUpdates;
        private boolean securityAlerts;
    }
    
    @Data
    public static class AppearanceSettings {
        private String theme;
        private boolean autoSwitchTheme;
        private String fontFamily;
        private int fontSize;
        private boolean reduceMotion;
        private boolean highContrast;
    }
    
    @Data
    public static class LanguageSettings {
        private String language;
        private String timezone;
        private String dateFormat;
        private String timeFormat;
    }
    
    @Data
    public static class PrivacySettings {
        private boolean profileVisible;
        private boolean activityVisible;
        private boolean showEmail;
        private boolean showPhone;
        private List<String> blockedUsers;
    }
    
    @Data
    public static class BillingSettings {
        private String billingEmail;
        private String billingAddress;
        private String city;
        private String postalCode;
        private List<PaymentMethod> paymentMethods;
    }
    
    @Data
    public static class IntegrationSettings {
        private Map<String, String> apiKeys;
        private List<String> connectedServices;
    }
    
    @Data
    public static class PaymentMethod {
        private String type;
        private String provider;
        private String accountNumber;
        private boolean isDefault;
    }
} 