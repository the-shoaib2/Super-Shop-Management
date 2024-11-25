package com.server.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.server.dto.AuthRequest;
import com.server.exception.AuthenticationException;
import com.server.exception.UserAlreadyExistsException;
import com.server.model.store.StoreOwner;
import com.server.repository.StoreOwnerRepository;
import com.server.util.IdGenerator;

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
            
        if (storeOwner.getOwnerId() == null) {
            storeOwner.setOwnerId(IdGenerator.generateOwnerId());
        }
            
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