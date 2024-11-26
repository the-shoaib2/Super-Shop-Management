package com.server.service.accounts;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.dto.accounts.settings.AccountSettingsDTO;
import com.server.exception.common.ResourceNotFoundException;
import com.server.model.accounts.AccountSettings;
import com.server.repository.accounts.AccountSettingsRepository;

import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AccountSettingsService {
    
    private final AccountSettingsRepository accountSettingsRepository;

    public AccountSettingsDTO getSettings(String userId) {
        AccountSettings settings = getAccountSettings(userId);
        return mapToDTO(settings);
    }

    @Transactional
    public AccountSettingsDTO.LanguageSettings updateLanguageSettings(String userId, AccountSettingsDTO.LanguageSettings dto) {
        AccountSettings settings = getAccountSettings(userId);
        
        AccountSettings.LanguageSettings language = settings.getLanguage();
        if (language == null) {
            language = new AccountSettings.LanguageSettings();
            settings.setLanguage(language);
        }
        
        language.setLanguage(dto.getLanguage().getPrimaryLanguage());
        language.setTimezone(dto.getTimezone().getTimezone());
        language.setDateFormat(dto.getDateTime().getDateFormat());
        language.setTimeFormat(dto.getDateTime().getTimeFormat());
        
        settings.setUpdatedAt(LocalDateTime.now());
        accountSettingsRepository.save(settings);
        return dto;
    }

    @Transactional
    public AccountSettingsDTO.AppearanceSettings updateAppearanceSettings(String userId, AccountSettingsDTO.AppearanceSettings dto) {
        AccountSettings settings = getAccountSettings(userId);
        
        AccountSettings.AppearanceSettings appearance = settings.getAppearance();
        if (appearance == null) {
            appearance = new AccountSettings.AppearanceSettings();
            settings.setAppearance(appearance);
        }
        
        if (dto.getTheme() != null) {
            appearance.setTheme(dto.getTheme().getMode().toString());
            appearance.setAutoSwitchTheme(dto.getTheme().isAutoSwitch());
        }
        
        if (dto.getFont() != null) {
            appearance.setFontFamily(dto.getFont().getFontFamily());
            appearance.setFontSize(dto.getFont().getFontSize().getSize());
        }
        
        if (dto.getAccessibility() != null) {
            appearance.setReduceMotion(dto.getAccessibility().isReduceMotion());
            appearance.setHighContrast(dto.getAccessibility().isHighContrast());
        }
        
        settings.setUpdatedAt(LocalDateTime.now());
        accountSettingsRepository.save(settings);
        return dto;
    }

    @Transactional
    public AccountSettingsDTO.NotificationSettings updateNotificationSettings(String userId, AccountSettingsDTO.NotificationSettings dto) {
        AccountSettings settings = getAccountSettings(userId);
        
        AccountSettings.NotificationSettings notifications = settings.getNotifications();
        if (notifications == null) {
            notifications = new AccountSettings.NotificationSettings();
            settings.setNotifications(notifications);
        }
        
        if (dto.getEmail() != null) {
            notifications.setEmailEnabled(dto.getEmail().isEnabled());
            notifications.setMarketingEmails(dto.getEmail().isMarketingEmails());
            notifications.setOrderUpdates(dto.getEmail().isOrderUpdates());
        }
        
        if (dto.getPush() != null) {
            notifications.setPushEnabled(dto.getPush().isEnabled());
        }
        
        settings.setUpdatedAt(LocalDateTime.now());
        accountSettingsRepository.save(settings);
        return dto;
    }

    private AccountSettings getAccountSettings(String userId) {
        return accountSettingsRepository.findByUserId(userId)
            .orElseGet(() -> createDefaultSettings(userId));
    }
    
    private AccountSettings createDefaultSettings(String userId) {
        AccountSettings settings = new AccountSettings();
        settings.setUserId(userId);
        settings.setUpdatedAt(LocalDateTime.now());
        return accountSettingsRepository.save(settings);
    }
    
    private AccountSettingsDTO mapToDTO(AccountSettings settings) {
        AccountSettingsDTO dto = new AccountSettingsDTO();
        // Map settings to DTO...
        return dto;
    }
} 