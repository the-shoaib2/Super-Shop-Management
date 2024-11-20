package com.admin.service;

import com.admin.dto.AuthRequest;
import com.admin.model.StoreOwner;
import com.admin.repository.StoreOwnerRepository;
import com.admin.exception.UserAlreadyExistsException;
import com.admin.exception.AuthenticationException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final StoreOwnerRepository storeOwnerRepository;
    private final PasswordEncoder passwordEncoder;

    public StoreOwner register(StoreOwner storeOwner) {
        storeOwnerRepository.findByEmail(storeOwner.getEmail())
            .ifPresent(user -> {
                throw new UserAlreadyExistsException("Email already exists");
            });
            
        storeOwner.setPassword(passwordEncoder.encode(storeOwner.getPassword()));
        storeOwner.setCreatedAt(LocalDateTime.now());
        return storeOwnerRepository.save(storeOwner);
    }

    public StoreOwner login(AuthRequest request) {
        return storeOwnerRepository.findByEmail(request.getEmail())
            .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
            .map(user -> {
                user.setLastLogin(LocalDateTime.now());
                storeOwnerRepository.save(user);
                return user;
            })
            .orElseThrow(() -> new AuthenticationException("Invalid credentials"));
    }

    public StoreOwner updateOwner(StoreOwner owner) {
        return storeOwnerRepository.save(owner);
    }
} 