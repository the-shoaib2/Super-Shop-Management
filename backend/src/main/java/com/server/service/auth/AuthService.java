package com.server.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.server.dto.accounts.auth.AuthRequest;
import com.server.exception.auth.AuthenticationException;
import com.server.exception.auth.UnauthorizedException;
import com.server.exception.auth.UserAlreadyExistsException;
import com.server.exception.common.ResourceNotFoundException;
import com.server.model.accounts.Owner;
import com.server.repository.accounts.StoreOwnerRepository;
import com.server.util.IdGenerator;

import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class AuthService {
    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    
    private final StoreOwnerRepository storeOwnerRepository;
    private final PasswordEncoder passwordEncoder;

    public Owner register(Owner storeOwner) {
        try {
            // Check if email exists
            storeOwnerRepository.findByEmail(storeOwner.getEmail())
                .ifPresent(user -> {
                    throw new UserAlreadyExistsException("Email already exists");
                });
                
            // Generate owner ID if not present
            if (storeOwner.getOwnerId() == null) {
                storeOwner.setOwnerId(IdGenerator.generateOwnerId());
            }
                
            // Encode password and set timestamps
            storeOwner.setPassword(passwordEncoder.encode(storeOwner.getPassword()));
            storeOwner.setCreatedAt(LocalDateTime.now());
            storeOwner.setUpdatedAt(LocalDateTime.now());
            storeOwner.setActive(true);
            
            // Save and return
            return storeOwnerRepository.save(storeOwner);
        } catch (UserAlreadyExistsException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Registration failed: ", e);
            throw new RuntimeException("Failed to register user: " + e.getMessage());
        }
    }

    public Owner login(AuthRequest request) {
        try {
            logger.info("Attempting login for email: {}", request.getEmail());
            
            // Find owner by email
            Owner owner = storeOwnerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logger.error("No user found with email: {}", request.getEmail());
                    return new UnauthorizedException("Invalid email or password");
                });

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), owner.getPassword())) {
                logger.error("Invalid password for email: {}", request.getEmail());
                throw new UnauthorizedException("Invalid email or password");
            }

            // Check if account is active
            if (!owner.isActive()) {
                logger.error("Account is inactive for email: {}", request.getEmail());
                throw new UnauthorizedException("Account is inactive");
            }

            // Update last login and timestamps
            owner.setLastLogin(LocalDateTime.now());
            owner.setUpdatedAt(LocalDateTime.now());
            
            // Save and return updated owner
            Owner updatedOwner = storeOwnerRepository.save(owner);
            logger.info("Login successful for email: {}", request.getEmail());
            
            return updatedOwner;
            
        } catch (UnauthorizedException e) {
            logger.error("Login failed - Unauthorized: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Login failed - Unexpected error: ", e);
            throw new AuthenticationException("An unexpected error occurred during login");
        }
    }

    public Owner updateOwner(Owner owner) {
        try {
            owner.setUpdatedAt(LocalDateTime.now());
            return storeOwnerRepository.save(owner);
        } catch (Exception e) {
            logger.error("Failed to update owner: ", e);
            throw new RuntimeException("Failed to update owner: " + e.getMessage());
        }
    }

    public Owner getOwnerByEmail(String email) {
        return storeOwnerRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
    }
} 