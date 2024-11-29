package com.server.controller.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.dto.auth.AuthRequest;
import com.server.dto.auth.AuthResponse;
import com.server.dto.auth.LoginRequest;
import com.server.model.accounts.Owner;
import com.server.service.auth.AuthService;
import com.server.util.ApiResponse;
import com.server.util.TokenUtil;
import com.server.exception.UserAlreadyExistsException;
import com.server.exception.auth.UnauthorizedException;
import com.server.exception.auth.AuthenticationException;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private static final int COOKIE_MAX_AGE = 86400; // 24 hours

    private final TokenUtil tokenUtil;
    private final AuthService authService;


    // Register a new store owner
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(
            @Valid @RequestBody AuthRequest authRequest,
            BindingResult bindingResult,
            HttpServletResponse response) {
        
        // Log the incoming request
        logger.debug("Registration request received: {}", authRequest);
        
        // Validate input and return detailed error messages
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> {
                String field = error.getField();
                String message = error.getDefaultMessage();
                errors.put(field, message);
                logger.error("Validation error for field {}: {}", field, message);
            });
            
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed", errors));
        }

        try {
            // Create new Owner from AuthRequest
            Owner storeOwner = new Owner();
            storeOwner.setEmail(authRequest.getEmail());
            storeOwner.setPassword(authRequest.getPassword());
            storeOwner.setFullName(authRequest.getFullName());
            storeOwner.setPhone(authRequest.getPhoneNumber());
            storeOwner.setAddress(authRequest.getAddress());
            storeOwner.setDescription(authRequest.getDescription());
            
            // Set default values
            storeOwner.setActive(true);
            storeOwner.setLastLogin(LocalDateTime.now());
            storeOwner.setAvaterUrls(new ArrayList<>());
            storeOwner.setWebsites(new ArrayList<>());
            storeOwner.setStores(new ArrayList<>());
            
            Owner savedOwner = authService.register(storeOwner);
            
            // Generate tokens
            String token = tokenUtil.generateToken(savedOwner);
            String refreshToken = tokenUtil.generateRefreshToken(savedOwner);
            
            savedOwner.setRefreshToken(refreshToken);
            authService.updateOwner(savedOwner);
            
            // Add auth cookie
            addAuthCookie(response, token);
            
            AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .userId(savedOwner.getId())
                .ownerId(savedOwner.getOwnerId())
                .email(savedOwner.getEmail())
                .fullName(savedOwner.getFullName())
                .currentStoreId(savedOwner.getCurrentStoreId())
                .loginTime(LocalDateTime.now())
                .isStoreCreated(savedOwner.getCurrentStoreId() != null)
                .build();

            return ResponseEntity.ok(ApiResponse.success("Registration successful", authResponse));
        } catch (UserAlreadyExistsException e) {
            logger.error("Registration failed - Email already exists: {}", authRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("Email already registered", null));
        } catch (Exception e) {
            logger.error("Registration failed with error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage(), null));
        }
    }

    // Login a store owner
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(
            @Valid @RequestBody LoginRequest request,
            BindingResult bindingResult,
            HttpServletResponse response) {
        
        try {
            // Log the incoming request (mask password)
            logger.debug("Login request received for email: {}", request.getEmail());
            
            // Validate input
            if (bindingResult.hasErrors()) {
                Map<String, String> errors = new HashMap<>();
                bindingResult.getFieldErrors().forEach(error -> {
                    errors.put(error.getField(), error.getDefaultMessage());
                });
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Validation failed", errors));
            }

            // Attempt login
            Owner owner = authService.login(request);
            
            // Generate tokens
            String accessToken = tokenUtil.generateToken(owner);
            String refreshToken = tokenUtil.generateRefreshToken(owner);
            
            // Update owner with refresh token
            owner.setRefreshToken(refreshToken);
            owner.setLastLogin(LocalDateTime.now());
            authService.updateOwner(owner);
            
            // Add auth cookie
            addAuthCookie(response, accessToken);

            // Build response
            AuthResponse authResponse = AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .userId(owner.getId())
                .email(owner.getEmail())
                .fullName(owner.getFullName())
                .currentStoreId(owner.getCurrentStoreId())
                .loginTime(LocalDateTime.now())
                .isStoreCreated(owner.getCurrentStoreId() != null)
                .build();

            return ResponseEntity.ok(ApiResponse.success("Login successful", authResponse));
            
        } catch (UnauthorizedException e) {
            logger.error("Login failed - Unauthorized: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage(), null));
                    
        } catch (AuthenticationException e) {
            logger.error("Login failed - Authentication error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(e.getMessage(), null));
                    
        } catch (Exception e) {
            logger.error("Login failed with unexpected error", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An unexpected error occurred", null));
        }
    }

    // Add an auth cookie to the response
    private void addAuthCookie(HttpServletResponse response, String token) {
        try {
            Cookie cookie = new Cookie("token", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setMaxAge(COOKIE_MAX_AGE);
            cookie.setPath("/");
            response.addCookie(cookie);
            response.setHeader("Set-Cookie", String.format("%s; %s", cookie.toString(), "SameSite=Strict"));
        } catch (Exception e) {
            throw new RuntimeException("Failed to add auth cookie", e);
        }
    }

    // Logout a store owner
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            Cookie cookie = new Cookie("token", null);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
            response.setHeader("Set-Cookie", String.format("%s; %s", cookie.toString(), "SameSite=Strict"));
            return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Logout failed: " + e.getMessage(), null));
        }
    }

    // Check if the token is valid
    @GetMapping("/check-token")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<String>> checkToken() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Token is valid", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Token is invalid", null));
        }
    }

}