package com.server.controller.accounts;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.server.dto.accounts.AccountDTO;
import com.server.service.accounts.AccountService;
import com.server.util.ApiResponse;
import com.server.dto.accounts.AccountPreferencesDTO;
import com.server.dto.accounts.ChangePasswordRequest;
import com.server.exception.ResourceNotFoundException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;

@Slf4j
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    
    private final AccountService accountService;
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AccountDTO>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User not authenticated", null));
            }
            
            String username = userDetails.getUsername();
            log.debug("Fetching profile for user: {}", username);
            AccountDTO profile = accountService.getProfile(username);
            
            if (profile == null) {
                return ResponseEntity.notFound()
                    .build();
            }
            
            return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound()
                .build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error fetching profile: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<AccountDTO>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AccountDTO accountDTO) {
        try {
            AccountDTO updated = accountService.updateProfile(userDetails.getUsername(), accountDTO);
            return ResponseEntity.ok(ApiResponse.success(updated));
        } catch (Exception e) {
            log.error("Error updating profile for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error updating profile: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            accountService.changePassword(userDetails.getUsername(), request);
            return ResponseEntity.ok(ApiResponse.success(null));
        } catch (Exception e) {
            log.error("Error changing password for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error changing password: " + e.getMessage(), null));
        }
    }
    
    @PutMapping("/me/preferences")
    public ResponseEntity<ApiResponse<AccountPreferencesDTO>> updatePreferences(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AccountPreferencesDTO preferencesDTO) {
        try {
            AccountPreferencesDTO updated = accountService.updatePreferences(
                userDetails.getUsername(), preferencesDTO);
            return ResponseEntity.ok(ApiResponse.success(updated));
        } catch (Exception e) {
            log.error("Error updating preferences for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error updating preferences: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/me/avatar")
    public ResponseEntity<ApiResponse<String>> updateAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = accountService.updateAvatar(userDetails.getUsername(), file);
            return ResponseEntity.ok(ApiResponse.success(avatarUrl));
        } catch (Exception e) {
            log.error("Error updating avatar for user: {}", userDetails.getUsername(), e);
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Error updating avatar: " + e.getMessage(), null));
        }
    }
} 