package com.server.service.accounts;

import com.server.dto.accounts.AccountDTO;
import com.server.dto.accounts.AccountPreferencesDTO;
import com.server.dto.accounts.ChangePasswordRequest;
import com.server.model.accounts.AccountPreferences;
import com.server.model.accounts.Owner;
import com.server.exception.InvalidPasswordException;
import com.server.exception.ResourceNotFoundException;
import com.server.repository.accounts.AccountPreferencesRepository;
import com.server.repository.accounts.StoreOwnerRepository;
import com.server.service.storage.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Qualifier;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {
    private final StoreOwnerRepository storeOwnerRepository;
    private final PasswordEncoder passwordEncoder;
    @Qualifier("fileStorageService")
    private final FileStorageService fileStorageService;
    private final AccountPreferencesRepository preferencesRepository;

    public AccountDTO getProfile(String userIdentifier) {
        Owner owner = storeOwnerRepository.findByEmail(userIdentifier)
            .orElseGet(() -> storeOwnerRepository.findByOwnerId(userIdentifier)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
                
        log.debug("Found store owner: {}", owner.getEmail());
        return mapToOwnerDTO(owner);
    }

    private AccountDTO mapToOwnerDTO(Owner owner) {
        if (owner == null) {
            throw new ResourceNotFoundException("Owner not found");
        }

        AccountPreferences preferences = preferencesRepository
            .findByUserId(owner.getId())
            .orElse(new AccountPreferences());

        return AccountDTO.builder()
            .id(owner.getId())
            .email(owner.getEmail())
            .fullName(owner.getFullName())
            .phone(owner.getPhone() != null ? owner.getPhone() : "")
            .address(owner.getAddress() != null ? owner.getAddress() : "")
            .description(owner.getDescription() != null ? owner.getDescription() : "")
            .websites(owner.getWebsites())
            .avatarUrl(owner.getAvatarUrl() != null ? owner.getAvatarUrl() : "")
            .ownerId(owner.getOwnerId())
            .isEmailVisible(owner.isEmailVisible())
            .isPhoneVisible(owner.isPhoneVisible())
            .isActive(owner.isActive())
            .isOnline(owner.isOnline())
            .lastActive(owner.getLastActive())
            .preferences(mapToPreferencesDTO(preferences))
            .build();
    }


    @Transactional
    public AccountDTO updateProfile(String userId, AccountDTO accountDTO) {
        Owner owner = storeOwnerRepository.findByEmail(userId)
            .orElseGet(() -> storeOwnerRepository.findByOwnerId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found")));
                
        if (accountDTO.getFullName() != null) {
            owner.setFullName(accountDTO.getFullName());
        }
        if (accountDTO.getPhone() != null) {
            owner.setPhone(accountDTO.getPhone());
        }
        if (accountDTO.getAddress() != null) {
            owner.setAddress(accountDTO.getAddress());
        }
        if (accountDTO.getDescription() != null) {
            owner.setDescription(accountDTO.getDescription());
        }
        if (accountDTO.getWebsites() != null) {
            accountDTO.getWebsites().forEach(website -> {
                if (website.getAddedAt() == null) {
                    website.setAddedAt(LocalDateTime.now());
                }
            });
            owner.setWebsites(accountDTO.getWebsites());
        }
        if (accountDTO.getAvatarUrl() != null) {
            owner.setAvatarUrl(accountDTO.getAvatarUrl());
            log.debug("Updated avatarUrl to: {}", accountDTO.getAvatarUrl());
        }
        owner.setEmailVisible(accountDTO.isEmailVisible());
        owner.setPhoneVisible(accountDTO.isPhoneVisible());
        owner.setOnline(accountDTO.isOnline());
        owner.setActive(accountDTO.isActive());
        
        if (accountDTO.getLastActive() != null) {
            owner.setLastActive(accountDTO.getLastActive());
        } else if (accountDTO.isOnline()) {
            owner.setLastActive(LocalDateTime.now());
        }
        
        log.info("Updating profile for owner: {}", owner.getFullName());
        Owner savedOwner = storeOwnerRepository.save(owner);
        log.info("Profile updated successfully for owner: {}", savedOwner.getFullName());
        
        return mapToOwnerDTO(savedOwner);
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        Owner owner = storeOwnerRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
            
        if (!passwordEncoder.matches(request.getCurrentPassword(), owner.getPassword())) {
            throw new InvalidPasswordException("Current password is incorrect");
        }
        owner.setPassword(passwordEncoder.encode(request.getNewPassword()));
        storeOwnerRepository.save(owner);
    }

    @Transactional
    public AccountPreferencesDTO updatePreferences(String userId, AccountPreferencesDTO preferencesDTO) {
        Owner owner = storeOwnerRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        
        AccountPreferences preferences = preferencesRepository
            .findByUserId(owner.getId())
            .orElse(new AccountPreferences());
        
        preferences.setUserId(owner.getId());
        preferences.setTheme(preferencesDTO.getTheme());
        preferences.setFontSize(preferencesDTO.getFontSize());
        preferences.setReducedMotion(preferencesDTO.isReducedMotion());
        preferences.setLanguage(preferencesDTO.getLanguage());
        preferences.setTimeZone(preferencesDTO.getTimeZone());
        preferences.setDateFormat(preferencesDTO.getDateFormat());
        preferences.setEmailNotifications(preferencesDTO.isEmailNotifications());
        preferences.setPushNotifications(preferencesDTO.isPushNotifications());
        preferences.setMarketingEmails(preferencesDTO.isMarketingEmails());
        preferences.setProfileVisibility(preferencesDTO.getProfileVisibility());
        preferences.setActivityStatus(preferencesDTO.isActivityStatus());
        preferences.setDataSharing(preferencesDTO.isDataSharing());

        AccountPreferences saved = preferencesRepository.save(preferences);
        return mapToPreferencesDTO(saved);
    }

    @Transactional
    public String updateAvatar(String userId, MultipartFile file) {
        Owner owner = storeOwnerRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String avatarUrl = fileStorageService.storeFile(file);
        owner.setAvatarUrl(avatarUrl);
        storeOwnerRepository.save(owner);
        log.debug("Updated avatar URL to: {}", avatarUrl);

        return avatarUrl;
    }

    private AccountPreferencesDTO mapToPreferencesDTO(AccountPreferences preferences) {
        AccountPreferencesDTO dto = new AccountPreferencesDTO();
        dto.setTheme(preferences.getTheme());
        dto.setFontSize(preferences.getFontSize());
        dto.setReducedMotion(preferences.isReducedMotion());
        dto.setLanguage(preferences.getLanguage());
        dto.setTimeZone(preferences.getTimeZone());
        dto.setDateFormat(preferences.getDateFormat());
        dto.setEmailNotifications(preferences.isEmailNotifications());
        dto.setPushNotifications(preferences.isPushNotifications());
        dto.setMarketingEmails(preferences.isMarketingEmails());
        dto.setProfileVisibility(preferences.getProfileVisibility());
        dto.setActivityStatus(preferences.isActivityStatus());
        dto.setDataSharing(preferences.isDataSharing());
        return dto;
    }
} 