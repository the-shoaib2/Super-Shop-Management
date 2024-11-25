package com.server.service.accounts;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.server.dto.AccountSettingsDTO;
import com.server.model.store.StoreOwner;
import com.server.repository.StoreOwnerRepository;
import com.server.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountSettingsService {
    
    private final StoreOwnerRepository storeOwnerRepository;
    private final PasswordEncoder passwordEncoder;

    public AccountSettingsDTO getSettings(String userId) {
        StoreOwner owner = getStoreOwner(userId);
        return mapToDTO(owner.getAccountSettings());
    }
    
    public AccountSettingsDTO.GeneralSettings updateGeneralSettings(
            String userId, 
            AccountSettingsDTO.GeneralSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setTimezone(settings.getTimezone());
        accountSettings.setDateFormat(settings.getDateFormat());
        accountSettings.setCurrency(settings.getCurrency());
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AccountSettingsDTO.SecuritySettings updateSecuritySettings(
            String userId, 
            AccountSettingsDTO.SecuritySettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setTwoFactorEnabled(settings.isTwoFactorEnabled());
        accountSettings.setTwoFactorMethod(settings.getTwoFactorMethod());
        accountSettings.setTrustedDevices(settings.getTrustedDevices());
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AccountSettingsDTO.NotificationSettings updateNotificationSettings(
            String userId, 
            AccountSettingsDTO.NotificationSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setEmailNotifications(settings.isEmailNotifications());
        accountSettings.setPushNotifications(settings.isPushNotifications());
        accountSettings.setOrderNotifications(settings.isOrderNotifications());
        accountSettings.setMarketingNotifications(settings.isMarketingNotifications());
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AccountSettingsDTO.AppearanceSettings updateAppearanceSettings(
            String userId, 
            AccountSettingsDTO.AppearanceSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setTheme(settings.getTheme());
        accountSettings.setLayout(settings.getLayout());
        accountSettings.setCompactMode(settings.isCompactMode());
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AccountSettingsDTO.LanguageSettings updateLanguageSettings(
            String userId, 
            AccountSettingsDTO.LanguageSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setLanguage(settings.getLanguage());
        accountSettings.setRegion(settings.getRegion());
        accountSettings.setNumberFormat(settings.getNumberFormat());
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AccountSettingsDTO.PrivacySettings updatePrivacySettings(
            String userId, 
            AccountSettingsDTO.PrivacySettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setProfileVisible(settings.isProfileVisible());
        accountSettings.setActivityVisible(settings.isActivityVisible());
        accountSettings.setStoreVisible(settings.isStoreVisible());
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AccountSettingsDTO.BillingSettings updateBillingSettings(
            String userId, 
            AccountSettingsDTO.BillingSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setBillingEmail(settings.getBillingEmail());
        accountSettings.setBillingAddress(settings.getBillingAddress());
        accountSettings.setTaxId(settings.getTaxId());
        
        // Convert DTO payment methods to entity payment methods
        List<StoreOwner.PaymentMethod> paymentMethods = settings.getPaymentMethods().stream()
            .map(this::convertToPaymentMethod)
            .collect(Collectors.toList());
        accountSettings.setPaymentMethods(paymentMethods);
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    public AccountSettingsDTO.IntegrationSettings updateIntegrationSettings(
            String userId, 
            AccountSettingsDTO.IntegrationSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings accountSettings = owner.getAccountSettings();
        
        if (accountSettings == null) {
            accountSettings = new StoreOwner.AccountSettings();
            owner.setAccountSettings(accountSettings);
        }
        
        accountSettings.setApiKeys(settings.getApiKeys());
        accountSettings.setConnectedServices(settings.getConnectedServices());
        
        storeOwnerRepository.save(owner);
        return settings;
    }
    
    private StoreOwner getStoreOwner(String userId) {
        return storeOwnerRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Store owner not found"));
    }
    
    private AccountSettingsDTO mapToDTO(StoreOwner.AccountSettings settings) {
        if (settings == null) {
            return new AccountSettingsDTO();
        }
        
        AccountSettingsDTO dto = new AccountSettingsDTO();
        
        // Map general settings
        AccountSettingsDTO.GeneralSettings general = new AccountSettingsDTO.GeneralSettings();
        general.setTimezone(settings.getTimezone());
        general.setDateFormat(settings.getDateFormat());
        general.setCurrency(settings.getCurrency());
        dto.setGeneral(general);
        
        // Map other settings similarly...
        // Add mapping for all other setting categories
        
        return dto;
    }
    
    private StoreOwner.PaymentMethod convertToPaymentMethod(AccountSettingsDTO.PaymentMethodDTO dto) {
        StoreOwner.PaymentMethod paymentMethod = new StoreOwner.PaymentMethod();
        paymentMethod.setType(dto.getType());
        paymentMethod.setProvider(dto.getProvider());
        paymentMethod.setAccountNumber(dto.getAccountNumber());
        paymentMethod.setDefault(dto.isDefault());
        paymentMethod.setAddedAt(LocalDateTime.now());
        return paymentMethod;
    }
} 