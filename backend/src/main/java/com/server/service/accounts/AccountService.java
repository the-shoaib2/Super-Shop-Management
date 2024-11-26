package com.server.service.accounts;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.exception.common.ResourceNotFoundException;
import com.server.model.accounts.Owner;
import com.server.repository.accounts.StoreOwnerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccountService {
    
    private final StoreOwnerRepository storeOwnerRepository;

    public Owner getAccount(String userId) {
        return getStoreOwner(userId);
    }

    @Transactional
    public Owner updateAccount(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        owner.setAccountSettings(settings);
        return storeOwnerRepository.save(owner);
    }

    @Transactional
    public void deleteAccount(String userId) {
        Owner owner = getStoreOwner(userId);
        owner.setActive(false);
        storeOwnerRepository.save(owner);
    }

    @Transactional
    public Owner.AccountSettings updateGeneralSettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
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
    public Owner.AccountSettings updateSecuritySettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
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
    public Owner.AccountSettings updateNotificationSettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
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
    public Owner.AccountSettings updateAppearanceSettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
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
    public Owner.AccountSettings updateLanguageSettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
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
    public Owner.AccountSettings updatePrivacySettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
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
    public Owner.AccountSettings updateBillingSettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
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
    public Owner.AccountSettings updateIntegrationSettings(String userId, Owner.AccountSettings settings) {
        Owner owner = getStoreOwner(userId);
        Owner.AccountSettings currentSettings = owner.getAccountSettings();
        if (currentSettings == null) {
            currentSettings = new Owner.AccountSettings();
        }
        
        // Update integration settings
        currentSettings.setApiKeys(settings.getApiKeys());
        currentSettings.setConnectedServices(settings.getConnectedServices());
        
        owner.setAccountSettings(currentSettings);
        storeOwnerRepository.save(owner);
        return currentSettings;
    }

    private Owner getStoreOwner(String userId) {
        return storeOwnerRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Store owner not found"));
    }
} 