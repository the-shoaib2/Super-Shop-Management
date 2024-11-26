package com.server.controller.accounts;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.server.dto.accounts.settings.AccountSettingsDTO;
import com.server.service.accounts.AccountSettingsService;
import com.server.util.ApiResponse;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account/settings")
@RequiredArgsConstructor
@Validated
public class AccountSettingsController {
    
    private final AccountSettingsService accountSettingsService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<AccountSettingsDTO>> getSettings(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Settings retrieved successfully",
            accountSettingsService.getSettings(userId)
        ));
    }
    
    @PutMapping("/language")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.LanguageSettings>> updateLanguageSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.LanguageSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Language settings updated",
            accountSettingsService.updateLanguageSettings(userId, settings)
        ));
    }
    
    @PutMapping("/appearance")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.AppearanceSettings>> updateAppearanceSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.AppearanceSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Appearance settings updated",
            accountSettingsService.updateAppearanceSettings(userId, settings)
        ));
    }
    
    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.NotificationSettings>> updateNotificationSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.NotificationSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Notification settings updated",
            accountSettingsService.updateNotificationSettings(userId, settings)
        ));
    }
} 