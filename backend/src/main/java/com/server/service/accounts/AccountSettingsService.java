package com.server.service.accounts;

import org.springframework.stereotype.Service;

import com.server.dto.accounts.settings.AccountSettingsDTO;
import com.server.dto.accounts.settings.AccountSettingsDTO.*;
import com.server.exception.common.ResourceNotFoundException;
import com.server.model.accounts.Owner;
import com.server.repository.accounts.StoreOwnerRepository;

import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountSettingsService {
    
    private final StoreOwnerRepository storeOwnerRepository;

    public AccountSettingsDTO getSettings(String userId) {
        Owner owner = getStoreOwner(userId);
        return mapToDTO(owner.getAccountSettings());
    }
    
    public LanguageSettings updateLanguageSettings(String userId, LanguageSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings accountSettings = getOrCreateAccountSettings(owner);
        
        if (settings.getLanguage() != null) {
            accountSettings.setLanguage(settings.getLanguage().getPrimaryLanguage());
        }
        
        if (settings.getTimezone() != null) {
            accountSettings.setTimezone(settings.getTimezone().getTimezone());
        }
        
        if (settings.getDateTime() != null) {
            accountSettings.setDateFormat(settings.getDateTime().getDateFormat());
            accountSettings.setTimeFormat(settings.getDateTime().getTimeFormat());
        }
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AppearanceSettings updateAppearanceSettings(String userId, AppearanceSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings accountSettings = getOrCreateAccountSettings(owner);
        
        if (settings.getTheme() != null) {
            accountSettings.setTheme(settings.getTheme().getMode().toString());
            accountSettings.setAutoSwitchTheme(settings.getTheme().isAutoSwitch());
        }
        
        if (settings.getFont() != null) {
            accountSettings.setFontSize(settings.getFont().getFontSize().getSize());
            accountSettings.setFontFamily(settings.getFont().getFontFamily());
        }
        
        if (settings.getAccessibility() != null) {
            accountSettings.setReduceMotion(settings.getAccessibility().isReduceMotion());
            accountSettings.setHighContrast(settings.getAccessibility().isHighContrast());
        }
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public NotificationSettings updateNotificationSettings(String userId, NotificationSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings accountSettings = getOrCreateAccountSettings(owner);
        
        if (settings.getEmail() != null) {
            accountSettings.setEmailNotifications(settings.getEmail().isEnabled());
            accountSettings.setMarketingEmails(settings.getEmail().isMarketingEmails());
            accountSettings.setOrderUpdates(settings.getEmail().isOrderUpdates());
        }
        
        if (settings.getPush() != null) {
            accountSettings.setPushNotifications(settings.getPush().isEnabled());
            accountSettings.setDesktopNotifications(settings.getPush().isDesktopNotifications());
        }
        
        if (settings.getSecurity() != null) {
            accountSettings.setLoginAlerts(settings.getSecurity().isLoginAlerts());
            accountSettings.setPasswordChangeAlerts(settings.getSecurity().isPasswordChanges());
        }
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    private Owner getStoreOwner(String userId) {
        return storeOwnerRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Store owner not found"));
    }
    
    private Owner.AccountSettings getOrCreateAccountSettings(Owner owner) {
        Owner.AccountSettings accountSettings = owner.getAccountSettings();
        if (accountSettings == null) {
            accountSettings = new Owner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        return accountSettings;
    }
    
    private AccountSettingsDTO mapToDTO(Owner.AccountSettings settings) {
        if (settings == null) {
            return new AccountSettingsDTO();
        }
        
        AccountSettingsDTO dto = new AccountSettingsDTO();
        
        // Map Language Settings
        LanguageSettings language = new LanguageSettings();
        LanguageSettings.LanguagePreferences languagePrefs = new LanguageSettings.LanguagePreferences();
        languagePrefs.setPrimaryLanguage(settings.getLanguage());
        language.setLanguage(languagePrefs);
        
        LanguageSettings.TimeZoneSettings timezone = new LanguageSettings.TimeZoneSettings();
        timezone.setTimezone(settings.getTimezone());
        language.setTimezone(timezone);
        
        LanguageSettings.DateTimeSettings dateTime = new LanguageSettings.DateTimeSettings();
        dateTime.setDateFormat(settings.getDateFormat());
        dateTime.setTimeFormat(settings.getTimeFormat());
        language.setDateTime(dateTime);
        
        dto.setLanguage(language);
        
        // Map Appearance Settings
        AppearanceSettings appearance = new AppearanceSettings();
        AppearanceSettings.ThemeSettings theme = new AppearanceSettings.ThemeSettings();
        theme.setMode(AppearanceSettings.ThemeMode.valueOf(settings.getTheme()));
        theme.setAutoSwitch(settings.isAutoSwitchTheme());
        appearance.setTheme(theme);
        
        AppearanceSettings.FontSettings font = new AppearanceSettings.FontSettings();
        font.setFontFamily(settings.getFontFamily());
        font.setFontSize(getFontSizeEnum(settings.getFontSize()));
        appearance.setFont(font);
        
        AppearanceSettings.AccessibilitySettings accessibility = new AppearanceSettings.AccessibilitySettings();
        accessibility.setReduceMotion(settings.isReduceMotion());
        accessibility.setHighContrast(settings.isHighContrast());
        appearance.setAccessibility(accessibility);
        
        dto.setAppearance(appearance);
        
        return dto;
    }
    
    private AppearanceSettings.FontSize getFontSizeEnum(int size) {
        for (AppearanceSettings.FontSize fontSize : AppearanceSettings.FontSize.values()) {
            if (fontSize.getSize() == size) {
                return fontSize;
            }
        }
        return AppearanceSettings.FontSize.MEDIUM;
    }
} 