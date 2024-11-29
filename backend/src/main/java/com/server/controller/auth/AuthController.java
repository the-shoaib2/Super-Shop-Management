package com.server.controller.auth;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.dto.accounts.auth.AuthRequest;
import com.server.dto.accounts.auth.AuthResponse;
import com.server.dto.common.ValidationErrorResponse;
import com.server.model.accounts.Owner;
import com.server.service.auth.AuthService;
import com.server.util.ApiResponse;
import com.server.util.TokenUtil;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.time.LocalDateTime;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final int COOKIE_MAX_AGE = 86400; // 24 hours

    private final TokenUtil tokenUtil;
    private final AuthService authService;


    // Register a new store owner
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody Owner storeOwner,
            BindingResult bindingResult,
            HttpServletResponse response) {
        
        // Validate input
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorResponse.addError(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Validation failed", null));
        }

        try {
            // Set default values
            storeOwner.setActive(true);
            storeOwner.setLastLogin(LocalDateTime.now());
            storeOwner.setImages(new ArrayList<>());
            
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage(), null));
        }
    }

    // Login a store owner
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request,
            BindingResult bindingResult,
            HttpServletResponse response) {
        if (bindingResult.hasErrors()) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            bindingResult.getFieldErrors()
                    .forEach(error -> errorResponse.addError(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errorResponse);
        }

        try {
            Owner owner = authService.login(request);
            
            // Generate tokens with owner object
            String accessToken = tokenUtil.generateAccessToken(owner);
            String refreshToken = tokenUtil.generateRefreshToken(owner);
            
            owner.setRefreshToken(refreshToken);
            owner.setLastLogin(LocalDateTime.now());
            authService.updateOwner(owner);
            
            addAuthCookie(response, accessToken);

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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password", null));
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