package com.server.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AccountSettingsDTO {
    private GeneralSettings general;
    private SecuritySettings security;
    private NotificationSettings notifications;
    private AppearanceSettings appearance;
    private LanguageSettings language;
    private PrivacySettings privacy;
    private BillingSettings billing;
    private IntegrationSettings integrations;
    
    @Data
    public static class GeneralSettings {
        private String timezone;
        private String dateFormat;
        private String currency;
    }
    
    @Data
    public static class SecuritySettings {
        private boolean twoFactorEnabled;
        private String twoFactorMethod;
        private List<String> trustedDevices;
    }
    
    @Data
    public static class NotificationSettings {
        private boolean emailNotifications;
        private boolean pushNotifications;
        private boolean orderNotifications;
        private boolean marketingNotifications;
    }
    
    @Data
    public static class AppearanceSettings {
        private String theme;
        private String layout;
        private boolean compactMode;
    }
    
    @Data
    public static class LanguageSettings {
        private String language;
        private String region;
        private String numberFormat;
    }
    
    @Data
    public static class PrivacySettings {
        private boolean profileVisible;
        private boolean activityVisible;
        private boolean storeVisible;
    }
    
    @Data
    public static class BillingSettings {
        private String billingEmail;
        private String billingAddress;
        private String taxId;
        private List<PaymentMethodDTO> paymentMethods;
    }
    
    @Data
    public static class IntegrationSettings {
        private Map<String, String> apiKeys;
        private List<String> connectedServices;
    }
    
    @Data
    public static class PaymentMethodDTO {
        private String type;
        private String provider;
        private String accountNumber;
        private boolean isDefault;
    }
} 