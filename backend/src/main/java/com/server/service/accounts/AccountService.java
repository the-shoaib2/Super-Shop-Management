package com.server.service.accounts;

import com.server.dto.accounts.AccountDTO;
import com.server.dto.accounts.AccountPreferencesDTO;
import com.server.dto.accounts.ChangePasswordRequest;
import com.server.entity.accounts.AccountPreferences;
import com.server.entity.accounts.User;
import com.server.model.accounts.Owner;
import com.server.exception.InvalidPasswordException;
import com.server.exception.ResourceNotFoundException;
import com.server.repository.accounts.AccountPreferencesRepository;
import com.server.repository.accounts.UserRepository;
import com.server.repository.accounts.StoreOwnerRepository;
import com.server.service.storage.FileStorageService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Qualifier;

@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {
    private final UserRepository userRepository;
    private final StoreOwnerRepository storeOwnerRepository;
    private final PasswordEncoder passwordEncoder;
    @Qualifier("fileStorageService")
    private final FileStorageService fileStorageService;
    private final AccountPreferencesRepository preferencesRepository;

    public AccountDTO getProfile(String userIdentifier) {
        Owner owner = storeOwnerRepository.findByEmail(userIdentifier)
            .orElseGet(() -> storeOwnerRepository.findByOwnerId(userIdentifier)
                .orElse(null));
                
        if (owner != null) {
            log.debug("Found store owner: {}", owner.getEmail());
            return mapToOwnerDTO(owner);
        }
        
        User user = userRepository.findByEmail(userIdentifier)
            .orElseGet(() -> userRepository.findById(userIdentifier)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
        
        log.debug("Found user: {}", user.getEmail());
        return mapToUserDTO(user);
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
            .ownerId(owner.getOwnerId())
            // .phone(owner.getPhone())
            // .avatar(owner.getAvatarUrl())
            .preferences(mapToPreferencesDTO(preferences))
            .build();
    }

    private AccountDTO mapToUserDTO(User user) {
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        AccountPreferences preferences = preferencesRepository
            .findByUserId(user.getId())
            .orElse(new AccountPreferences());

        return AccountDTO.builder()
            .id(user.getId())
            .email(user.getEmail())
            .fullName(user.getName())
            .phone(user.getPhone())
            .avatar(user.getAvatarUrl())
            .preferences(mapToPreferencesDTO(preferences))
            .build();
    }

    @Transactional
    public AccountDTO updateProfile(String userId, AccountDTO accountDTO) {
        Owner owner = storeOwnerRepository.findById(userId)
            .orElse(null);
            
        if (owner != null) {
            owner.setFullName(accountDTO.getFullName());
            Owner savedOwner = storeOwnerRepository.save(owner);
            return mapToOwnerDTO(savedOwner);
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        user.setName(accountDTO.getFullName());
        user.setPhone(accountDTO.getPhone());
        User savedUser = userRepository.save(user);
        return mapToUserDTO(savedUser);
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        Owner owner = storeOwnerRepository.findById(userId)
            .orElse(null);
            
        if (owner != null) {
            if (!passwordEncoder.matches(request.getCurrentPassword(), owner.getPassword())) {
                throw new InvalidPasswordException("Current password is incorrect");
            }
            owner.setPassword(passwordEncoder.encode(request.getNewPassword()));
            storeOwnerRepository.save(owner);
            return;
        }
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public AccountPreferencesDTO updatePreferences(String userId, AccountPreferencesDTO preferencesDTO) {
        AccountPreferences preferences = preferencesRepository
            .findByUserId(userId)
            .orElse(new AccountPreferences());
        
        preferences.setUserId(userId);
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
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String avatarUrl = fileStorageService.storeFile(file);
        user.setAvatarUrl(avatarUrl);
        userRepository.save(user);

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