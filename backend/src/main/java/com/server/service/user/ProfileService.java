package com.server.service.user;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.server.dto.ProfileUpdateRequest;
import com.server.repository.UserRepository;
import com.server.service.storage.StorageService;
import com.server.entity.User;

@Service
public class ProfileService {
    
    private final UserRepository userRepository;
    private final StorageService storageService;

    public ProfileService(UserRepository userRepository, StorageService storageService) {
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    public User getProfile(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User updateProfile(ProfileUpdateRequest request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null && !request.getPhone().isEmpty()) {
            user.setPhone(request.getPhone());
        }
        
        return userRepository.save(user);
    }

    public User updateAvatar(MultipartFile file, UserDetails userDetails) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        try {
            String avatarUrl = storageService.storeFile(file, "avatars");
            user.setAvatarUrl(avatarUrl);
            return userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException("Could not store the avatar file", e);
        }
    }
} 