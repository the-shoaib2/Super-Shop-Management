package com.server.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.dto.AuthRequest;
import com.server.dto.AuthResponse;
import com.server.dto.ValidationErrorResponse;
import com.server.model.StoreOwner;
import com.server.service.AuthService;
import com.server.util.ApiResponse;
import com.server.util.TokenUtil;

import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final int COOKIE_MAX_AGE = 86400; // 24 hours

    private final TokenUtil tokenUtil;
    private final AuthService authService;


    // Register a new store owner
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<StoreOwner>> register(@Valid @RequestBody StoreOwner storeOwner,
            HttpServletResponse response) {
        try {
            StoreOwner savedOwner = authService.register(storeOwner);
            String token = tokenUtil.generateToken(savedOwner);
            addAuthCookie(response, token);
            return ResponseEntity.ok(ApiResponse.success("Registration successful", savedOwner));
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
            StoreOwner owner = (StoreOwner) authService.login(request);
            String token = tokenUtil.generateToken(owner);
            String refreshToken = tokenUtil.generateRefreshToken(owner.getEmail());
            
            owner.setRefreshToken(refreshToken);
            owner.setLastLogin(LocalDateTime.now());
            authService.updateOwner(owner);
            
            addAuthCookie(response, token);

            AuthResponse authResponse = new AuthResponse(
                    token,
                    owner.getEmail(),
                    owner.getStoreName(),
                    owner.getFullName());

            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            ValidationErrorResponse errorResponse = new ValidationErrorResponse();
            errorResponse.addError("auth", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
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

}