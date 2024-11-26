package com.server.dto.accounts.settings;

import lombok.Data;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.math.BigDecimal;

@Data
public class AccountSettingsDTO {
    private GeneralSettings general;
    private ProfileSettings profile;
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
        private String language;
        private String region;
    }
    
    @Data
    public static class ProfileSettings {
        private String fullName;
        private String email;
        private String phone;
        private String address;
        private String bio;
        private ProfileImage profileImage;
        private SocialLinks socialLinks;
        private AccountStatus accountStatus;
        private ProfilePreferences preferences;
        
        @Data
        public static class ProfileImage {
            private String url;
            private String type;  // JPG, GIF, PNG
            private Long size;    // in bytes, max 2MB
            private String thumbnailUrl;
        }
        
        @Data
        public static class SocialLinks {
            private String website;
            private String linkedin;
            private String twitter;
            private String github;
            private Map<String, String> other;  // For additional social links
        }
        
        @Data
        public static class AccountStatus {
            private String type;  // Standard, Premium, etc.
            private boolean isEmailVerified;
            private boolean isPhoneVerified;
            private boolean isActive;
            private String verificationStatus;
        }
        
        @Data
        public static class ProfilePreferences {
            private boolean showEmail;
            private boolean showPhone;
            private boolean showAddress;
            private boolean showSocialLinks;
            private boolean isPublicProfile;
            private NotificationPreferences notifications;
        }
        
        @Data
        public static class NotificationPreferences {
            private boolean emailNotifications;
            private boolean smsNotifications;
            private boolean pushNotifications;
            private List<String> notificationTypes;  // Types of notifications to receive
        }
    }
    
    @Data
    public static class SecuritySettings {
        private PasswordSettings password;
        private TwoFactorSettings twoFactor;
        private List<SecurityDevice> trustedDevices;
        private List<LoginHistory> loginHistory;
        private List<SecurityLog> securityLog;
        private List<RecoveryCode> recoveryCodes;

        @Data
        public static class PasswordSettings {
            private String currentPassword;
            private String newPassword;
            private String confirmPassword;
            private LocalDateTime lastChanged;
            private boolean requiresChange;
            private PasswordStrength strength;
        }

        @Data
        public static class TwoFactorSettings {
            private boolean isEnabled;
            private String method;  // "APP", "SMS", "EMAIL"
            private String backupEmail;
            private String backupPhone;
            private boolean isVerified;
            private LocalDateTime lastVerified;
            private String secretKey;
            private List<String> backupCodes;
        }

        @Data
        public static class SecurityDevice {
            private String deviceId;
            private String deviceName;
            private String browser;
            private String operatingSystem;
            private String ipAddress;
            private LocalDateTime lastUsed;
            private boolean isCurrentDevice;
            private boolean isTrusted;
        }

        @Data
        public static class LoginHistory {
            private String sessionId;
            private String deviceInfo;
            private String browser;
            private String operatingSystem;
            private String ipAddress;
            private String location;
            private LocalDateTime loginTime;
            private String status;  // "SUCCESS", "FAILED"
            private String failureReason;
        }

        @Data
        public static class SecurityLog {
            private String eventId;
            private String eventType;  // "PASSWORD_CHANGE", "2FA_ENABLED", etc.
            private String description;
            private String ipAddress;
            private String deviceInfo;
            private LocalDateTime timestamp;
            private String initiator;  // User or system
            private String status;
            private Map<String, String> additionalDetails;
        }

        @Data
        public static class RecoveryCode {
            private String code;
            private boolean isUsed;
            private LocalDateTime generatedAt;
            private LocalDateTime usedAt;
            private String usedFrom;  // Device/IP info if used
        }

        public enum PasswordStrength {
            WEAK,
            MEDIUM,
            STRONG,
            VERY_STRONG
        }
    }
    
    @Data
    public static class NotificationSettings {
        private EmailNotifications email;
        private PushNotifications push;
        private SecurityNotifications security;
        private AccountNotifications account;
        private List<String> notificationChannels; // "EMAIL", "PUSH", "SMS", etc.
        private NotificationPreferences preferences;

        @Data
        public static class EmailNotifications {
            private boolean enabled;
            private String emailAddress;
            private boolean marketingEmails;
            private boolean newsletterEmails;
            private boolean orderUpdates;
            private boolean productAlerts;
            private boolean securityAlerts;
            private boolean accountUpdates;
            private EmailFrequency frequency;
        }

        @Data
        public static class PushNotifications {
            private boolean enabled;
            private boolean browserNotifications;
            private boolean mobileNotifications;
            private boolean desktopNotifications;
            private List<String> subscribedTopics;
            private Map<String, Boolean> devicePreferences;
            private NotificationTime quietHours;
        }

        @Data
        public static class SecurityNotifications {
            private boolean loginAlerts;
            private boolean passwordChanges;
            private boolean deviceChanges;
            private boolean twoFactorUpdates;
            private boolean unauthorizedAttempts;
            private boolean securityBreaches;
            private List<String> alertChannels; // Which channels to use for security alerts
        }

        @Data
        public static class AccountNotifications {
            private boolean profileChanges;
            private boolean settingsUpdates;
            private boolean billingAlerts;
            private boolean subscriptionUpdates;
            private boolean accountStatus;
            private boolean maintenanceAlerts;
        }

        @Data
        public static class NotificationPreferences {
            private boolean bundleNotifications;
            private int maxNotificationsPerDay;
            private String timezone;
            private List<String> mutedKeywords;
            private Map<String, NotificationPriority> prioritySettings;
        }

        @Data
        public static class NotificationTime {
            private LocalTime startTime;
            private LocalTime endTime;
            private List<DayOfWeek> activeDays;
            private String timezone;
        }

        @Data
        public static class EmailFrequency {
            private String type; // "IMMEDIATE", "DAILY_DIGEST", "WEEKLY_SUMMARY"
            private LocalTime digestTime; // Time for daily/weekly digests
            private DayOfWeek weeklyDay; // Day for weekly digests
        }

        public enum NotificationPriority {
            HIGH,
            MEDIUM,
            LOW,
            MUTED
        }
    }
    
    @Data
    public static class AppearanceSettings {
        private ThemeSettings theme;
        private FontSettings font;
        private AccessibilitySettings accessibility;
        private LayoutSettings layout;
        private ColorSettings colors;

        @Data
        public static class ThemeSettings {
            private ThemeMode mode; // LIGHT, DARK, SYSTEM
            private boolean autoSwitch; // Switch theme based on time
            private LocalTime darkModeStart;
            private LocalTime darkModeEnd;
            private String customTheme; // For custom theme support
        }

        @Data
        public static class FontSettings {
            private String fontFamily;
            private FontSize fontSize; // SMALL, MEDIUM, LARGE, X_LARGE
            private int lineHeight;
            private int letterSpacing;
            private boolean useSystemFont;
        }

        @Data
        public static class AccessibilitySettings {
            private boolean reduceMotion;
            private boolean highContrast;
            private boolean largeText;
            private boolean screenReader;
            private boolean keyboardNavigation;
            private int animationSpeed;
            private boolean focusHighlight;
        }

        @Data
        public static class LayoutSettings {
            private boolean compactMode;
            private boolean sidebarCollapsed;
            private String contentWidth; // FULL, CONTAINED
            private int spacingDensity; // 1-5
            private String menuPosition; // LEFT, TOP, RIGHT
        }

        @Data
        public static class ColorSettings {
            private String primaryColor;
            private String secondaryColor;
            private String accentColor;
            private String backgroundColor;
            private String textColor;
            private boolean useCustomColors;
        }

        public enum ThemeMode {
            LIGHT,
            DARK,
            SYSTEM
        }

        public enum FontSize {
            SMALL(12),
            MEDIUM(14),
            LARGE(16),
            X_LARGE(18);

            private final int size;

            FontSize(int size) {
                this.size = size;
            }

            public int getSize() {
                return size;
            }
        }
    }
    
    @Data
    public static class LanguageSettings {
        private LanguagePreferences language;
        private TimeZoneSettings timezone;
        private DateTimeSettings dateTime;
        private LocaleSettings locale;
        private CurrencySettings currency;

        @Data
        public static class LanguagePreferences {
            private String primaryLanguage;  // e.g., "en-US"
            private String secondaryLanguage;
            private boolean autoDetect;
            private List<String> preferredLanguages;
            private String fallbackLanguage;
            private TranslationSettings translation;
        }

        @Data
        public static class TimeZoneSettings {
            private String timezone;  // e.g., "Asia/Dhaka"
            private boolean autoDetect;
            private String format24Hour;  // "12" or "24"
            private boolean observeDST;  // Daylight Saving Time
            private String defaultWorkingDays;
            private LocalTime workingHoursStart;
            private LocalTime workingHoursEnd;
        }

        @Data
        public static class DateTimeSettings {
            private String dateFormat;  // e.g., "MM/DD/YYYY"
            private String timeFormat;  // e.g., "HH:mm:ss"
            private String shortDateFormat;
            private String longDateFormat;
            private String firstDayOfWeek;  // e.g., "SUNDAY"
            private boolean showWeekNumbers;
            private String calendarType;  // "Gregorian", "Lunar", etc.
        }

        @Data
        public static class LocaleSettings {
            private String country;
            private String region;
            private String numberFormat;
            private String measurementSystem;  // "Metric" or "Imperial"
            private String paperSize;  // "A4", "Letter", etc.
            private AddressFormat addressFormat;
            private PhoneNumberFormat phoneFormat;
        }

        @Data
        public static class CurrencySettings {
            private String primaryCurrency;
            private String displayFormat;
            private String symbolPosition;  // "before" or "after"
            private int decimalPlaces;
            private String thousandsSeparator;
            private String decimalSeparator;
            private List<String> additionalCurrencies;
        }

        @Data
        public static class TranslationSettings {
            private boolean autoTranslate;
            private String translationService;
            private List<String> excludedContent;
            private boolean showOriginalText;
            private Map<String, String> customTranslations;
        }

        @Data
        public static class AddressFormat {
            private List<String> addressLines;
            private boolean includePostalCode;
            private boolean includeState;
            private boolean includeCountry;
            private String postalCodeFormat;
        }

        @Data
        public static class PhoneNumberFormat {
            private String countryCode;
            private String format;
            private boolean includeCountryCode;
            private boolean validateFormat;
            private List<String> allowedTypes;  // mobile, landline, etc.
        }

        public enum DateFormatType {
            SHORT("MM/DD/YY"),
            MEDIUM("MM/DD/YYYY"),
            LONG("MMMM DD, YYYY"),
            FULL("EEEE, MMMM DD, YYYY");

            private final String format;

            DateFormatType(String format) {
                this.format = format;
            }

            public String getFormat() {
                return format;
            }
        }

        public enum TimeFormatType {
            H12("hh:mm a"),
            H24("HH:mm");

            private final String format;

            TimeFormatType(String format) {
                this.format = format;
            }

            public String getFormat() {
                return format;
            }
        }
    }
    
    @Data
    public static class PrivacySettings {
        private ProfilePrivacy profile;
        private DataPrivacy data;
        private AccountPrivacy account;
        private ActivityPrivacy activity;
        private List<String> blockedUsers;
        private List<String> restrictedUsers;

        @Data
        public static class ProfilePrivacy {
            private ProfileVisibility visibility;  // PUBLIC, PRIVATE, CONTACTS_ONLY
            private boolean showOnlineStatus;
            private boolean showLastSeen;
            private boolean showProfilePhoto;
            private boolean showEmail;
            private boolean showPhone;
            private boolean showLocation;
            private Map<String, Boolean> fieldVisibility;  // Custom field visibility
        }

        @Data
        public static class DataPrivacy {
            private boolean allowDataCollection;
            private boolean allowAnalytics;
            private boolean allowPersonalization;
            private boolean allowThirdPartySharing;
            private List<String> consentHistory;
            private LocalDateTime lastUpdated;
            private DataRetentionSettings retention;
        }

        @Data
        public static class AccountPrivacy {
            private boolean twoFactorEnabled;
            private boolean requireEmailVerification;
            private boolean allowPasswordReset;
            private List<String> trustedDevices;
            private List<String> loginHistory;
            private AccountDeletionSettings deletion;
        }

        @Data
        public static class ActivityPrivacy {
            private boolean showActivity;
            private boolean showOrders;
            private boolean showReviews;
            private boolean showLikes;
            private boolean showComments;
            private ActivityLogSettings activityLog;
        }

        @Data
        public static class DataRetentionSettings {
            private int dataRetentionPeriod;  // in days
            private boolean autoDeleteOldData;
            private List<String> dataTypes;
            private LocalDateTime nextCleanup;
        }

        @Data
        public static class AccountDeletionSettings {
            private boolean allowAccountDeletion;
            private int gracePeriod;  // in days
            private boolean preserveData;
            private List<String> requiredActions;
            private String deletionReason;
        }

        @Data
        public static class ActivityLogSettings {
            private boolean enabled;
            private int retentionPeriod;
            private List<String> trackedActivities;
            private boolean notifyOnUnusualActivity;
        }

        public enum ProfileVisibility {
            PUBLIC("Anyone can view"),
            PRIVATE("Only you can view"),
            CONTACTS_ONLY("Only contacts can view"),
            CUSTOM("Custom settings");

            private final String description;

            ProfileVisibility(String description) {
                this.description = description;
            }

            public String getDescription() {
                return description;
            }
        }

        @Data
        public static class PrivacyConsent {
            private String type;
            private boolean consented;
            private LocalDateTime consentDate;
            private String ipAddress;
            private String userAgent;
            private Map<String, Object> additionalData;
        }

        @Data
        public static class DataDownloadRequest {
            private String requestId;
            private LocalDateTime requestDate;
            private String format;  // JSON, CSV, etc.
            private List<String> dataTypes;
            private String status;
            private String downloadUrl;
            private LocalDateTime expiryDate;
        }
    }
    
    @Data
    public static class BillingSettings {
        private BillingAddress billingAddress;
        private List<PaymentMethod> paymentMethods;
        private List<BillingHistory> billingHistory;
        private TaxInformation taxInfo;
        private BillingPreferences preferences;

        @Data
        public static class BillingAddress {
            private String streetAddress;
            private String city;
            private String division;
            private String postalCode;
            private String country;
            private boolean isVerified;
            private LocalDateTime lastUpdated;
        }

        @Data
        public static class PaymentMethod {
            private String id;
            private PaymentType type;
            private PaymentStatus status;
            private boolean isDefault;
            private LocalDateTime addedAt;
            private LocalDateTime lastUsed;

            // Mobile Banking specific fields
            private MobileBankingDetails mobileBanking;
            
            // Bank Account specific fields
            private BankAccountDetails bankAccount;
        }

        @Data
        public static class MobileBankingDetails {
            private MobileBankingProvider provider;  // bKash, Nagad, Rocket, Upay
            private String accountNumber;
            private String accountName;
            private boolean isVerified;
            private String walletType;  // Personal, Merchant
            private BigDecimal dailyLimit;
            private BigDecimal monthlyLimit;
        }

        @Data
        public static class BankAccountDetails {
            private String bankName;
            private String accountNumber;
            private String accountHolderName;
            private String branchName;
            private String routingNumber;
            private String swiftCode;
            private AccountType accountType;
            private boolean isVerified;
        }

        @Data
        public static class BillingHistory {
            private String invoiceId;
            private LocalDateTime date;
            private BigDecimal amount;
            private String currency;
            private PaymentStatus status;
            private PaymentMethod paymentMethod;
            private String downloadUrl;
            private List<BillingItem> items;
        }

        @Data
        public static class BillingItem {
            private String description;
            private BigDecimal amount;
            private int quantity;
            private BigDecimal total;
            private String category;
            private LocalDateTime periodStart;
            private LocalDateTime periodEnd;
        }

        @Data
        public static class TaxInformation {
            private String taxId;
            private String vatNumber;
            private String businessNumber;
            private boolean isTaxExempt;
            private List<TaxDocument> taxDocuments;
        }

        @Data
        public static class BillingPreferences {
            private String defaultCurrency;
            private PaymentType preferredPaymentMethod;
            private boolean autoPayEnabled;
            private BigDecimal autoPayThreshold;
            private int paymentDueReminder;  // days before due date
            private boolean sendInvoiceEmails;
        }

        public enum PaymentType {
            MOBILE_BANKING("Mobile Banking"),
            BANK_ACCOUNT("Bank Account"),
            CASH("Cash"),
            CARD("Card");

            private final String display;

            PaymentType(String display) {
                this.display = display;
            }

            public String getDisplay() {
                return display;
            }
        }

        public enum MobileBankingProvider {
            BKASH("bKash"),
            NAGAD("Nagad"),
            ROCKET("Rocket"),
            UPAY("Upay");

            private final String display;

            MobileBankingProvider(String display) {
                this.display = display;
            }

            public String getDisplay() {
                return display;
            }
        }

        public enum AccountType {
            SAVINGS("Savings"),
            CURRENT("Current"),
            CHECKING("Checking");

            private final String display;

            AccountType(String display) {
                this.display = display;
            }

            public String getDisplay() {
                return display;
            }
        }

        public enum PaymentStatus {
            ACTIVE("Active"),
            PENDING("Pending"),
            VERIFIED("Verified"),
            FAILED("Failed"),
            EXPIRED("Expired");

            private final String display;

            PaymentStatus(String display) {
                this.display = display;
            }

            public String getDisplay() {
                return display;
            }
        }

        @Data
        public static class TaxDocument {
            private String type;
            private String number;
            private LocalDateTime issuedDate;
            private LocalDateTime expiryDate;
            private String documentUrl;
            private boolean isVerified;
        }
    }
    
    @Data
    public static class IntegrationSettings {
        private List<ConnectedApp> connectedApps;
        private List<AvailableIntegration> availableIntegrations;
        private IntegrationPreferences preferences;
        private Map<String, String> apiKeys;
        private List<WebhookConfig> webhooks;

        @Data
        public static class ConnectedApp {
            private String id;
            private String name;
            private String type;  // "STORAGE", "COMMUNICATION", "ANALYTICS", etc.
            private String icon;
            private ConnectionStatus status;
            private LocalDateTime connectedAt;
            private String connectedBy;
            private Map<String, String> config;
            private List<String> permissions;
            private LocalDateTime lastSync;
            private String refreshToken;
            private LocalDateTime tokenExpiry;
        }

        @Data
        public static class AvailableIntegration {
            private String id;
            private String name;
            private String description;
            private String icon;
            private String category;
            private List<String> features;
            private List<String> requiredPermissions;
            private boolean isPremium;
            private String setupGuide;
            private List<String> supportedRegions;
        }

        @Data
        public static class IntegrationPreferences {
            private boolean autoSync;
            private int syncInterval;  // in minutes
            private boolean notifyOnSync;
            private boolean notifyOnFailure;
            private Map<String, Boolean> featureToggles;
            private DataSyncSettings syncSettings;
        }

        @Data
        public static class WebhookConfig {
            private String id;
            private String url;
            private String secret;
            private List<String> events;
            private boolean isActive;
            private int retryAttempts;
            private LocalDateTime lastTriggered;
            private String version;
        }

        @Data
        public static class DataSyncSettings {
            private List<String> includedData;
            private List<String> excludedData;
            private String syncDirection;  // "PUSH", "PULL", "BIDIRECTIONAL"
            private ConflictResolution conflictResolution;
            private int batchSize;
        }

        public enum ConnectionStatus {
            CONNECTED("Connected"),
            DISCONNECTED("Disconnected"),
            PENDING("Pending"),
            FAILED("Failed"),
            EXPIRED("Expired");

            private final String display;

            ConnectionStatus(String display) {
                this.display = display;
            }

            public String getDisplay() {
                return display;
            }
        }

        public enum ConflictResolution {
            LATEST_WINS("Use Latest"),
            SOURCE_WINS("Keep Source"),
            TARGET_WINS("Use Target"),
            MANUAL("Manual Resolution");

            private final String display;

            ConflictResolution(String display) {
                this.display = display;
            }

            public String getDisplay() {
                return display;
            }
        }

        @Data
        public static class IntegrationStats {
            private int totalIntegrations;
            private int activeIntegrations;
            private int failedSync;
            private LocalDateTime lastSyncTime;
            private Map<String, Integer> apiUsage;
            private List<SyncHistory> syncHistory;
        }

        @Data
        public static class SyncHistory {
            private String integrationId;
            private LocalDateTime syncTime;
            private String status;
            private String details;
            private int recordsProcessed;
            private int errors;
            private long duration;  // in milliseconds
        }
    }
    
    @Data
    public static class PaymentMethodDTO {
        private String type;
        private String provider;
        private String accountNumber;
        private boolean isDefault;
    }
} 