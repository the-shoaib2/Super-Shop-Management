package com.server.service.accounts;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.server.model.store.StoreOwner;
import com.server.repository.StoreOwnerRepository;
import com.server.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    
    private final StoreOwnerRepository storeOwnerRepository;

    public StoreOwner getAccount(String userId) {
        return getStoreOwner(userId);
    }

    @Transactional
    public StoreOwner updateAccount(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        owner.setAccountSettings(settings);
        return storeOwnerRepository.save(owner);
    }

    @Transactional
    public void deleteAccount(String userId) {
        StoreOwner owner = getStoreOwner(userId);
        owner.setActive(false);
        storeOwnerRepository.save(owner);
    }

    @Transactional
    public StoreOwner.AccountSettings updateGeneralSettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update general settings
        currentSettings.setTimezone(settings.getTimezone());
        currentSettings.setDateFormat(settings.getDateFormat());
        currentSettings.setCurrency(settings.getCurrency());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    @Transactional
    public StoreOwner.AccountSettings updateSecuritySettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update security settings
        currentSettings.setTwoFactorEnabled(settings.isTwoFactorEnabled());
        currentSettings.setTwoFactorMethod(settings.getTwoFactorMethod());
        currentSettings.setTrustedDevices(settings.getTrustedDevices());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    @Transactional
    public StoreOwner.AccountSettings updateNotificationSettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update notification settings
        currentSettings.setEmailNotifications(settings.isEmailNotifications());
        currentSettings.setPushNotifications(settings.isPushNotifications());
        currentSettings.setOrderNotifications(settings.isOrderNotifications());
        currentSettings.setMarketingNotifications(settings.isMarketingNotifications());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    @Transactional
    public StoreOwner.AccountSettings updateAppearanceSettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update appearance settings
        currentSettings.setTheme(settings.getTheme());
        currentSettings.setLayout(settings.getLayout());
        currentSettings.setCompactMode(settings.isCompactMode());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    @Transactional
    public StoreOwner.AccountSettings updateLanguageSettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update language settings
        currentSettings.setLanguage(settings.getLanguage());
        currentSettings.setRegion(settings.getRegion());
        currentSettings.setNumberFormat(settings.getNumberFormat());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    @Transactional
    public StoreOwner.AccountSettings updatePrivacySettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update privacy settings
        currentSettings.setProfileVisible(settings.isProfileVisible());
        currentSettings.setActivityVisible(settings.isActivityVisible());
        currentSettings.setStoreVisible(settings.isStoreVisible());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    @Transactional
    public StoreOwner.AccountSettings updateBillingSettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update billing settings
        currentSettings.setBillingEmail(settings.getBillingEmail());
        currentSettings.setBillingAddress(settings.getBillingAddress());
        currentSettings.setTaxId(settings.getTaxId());
        currentSettings.setPaymentMethods(settings.getPaymentMethods());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    @Transactional
    public StoreOwner.AccountSettings updateIntegrationSettings(String userId, StoreOwner.AccountSettings settings) {
        StoreOwner owner = getStoreOwner(userId);
        StoreOwner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new StoreOwner.AccountSettings();
        }
        
        // Update integration settings
        currentSettings.setApiKeys(settings.getApiKeys());
        currentSettings.setConnectedServices(settings.getConnectedServices());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    private StoreOwner getStoreOwner(String userId) {
        return storeOwnerRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Store owner not found"));
    }
} 