package com.server.controller.accounts;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.server.dto.accounts.settings.AccountSettingsDTO;
import com.server.service.accounts.AccountSettingsService;
import com.server.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account/settings")
@RequiredArgsConstructor
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
    
    @PutMapping("/general")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.GeneralSettings>> updateGeneralSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.GeneralSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "General settings updated",
            accountSettingsService.updateGeneralSettings(userId, settings)
        ));
    }
    
    @PutMapping("/security")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.SecuritySettings>> updateSecuritySettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.SecuritySettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Security settings updated",
            accountSettingsService.updateSecuritySettings(userId, settings)
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
    
    @PutMapping("/appearance")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.AppearanceSettings>> updateAppearanceSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.AppearanceSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Appearance settings updated",
            accountSettingsService.updateAppearanceSettings(userId, settings)
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
    
    @PutMapping("/privacy")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.PrivacySettings>> updatePrivacySettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.PrivacySettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Privacy settings updated",
            accountSettingsService.updatePrivacySettings(userId, settings)
        ));
    }
    
    @PutMapping("/billing")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.BillingSettings>> updateBillingSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.BillingSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Billing settings updated",
            accountSettingsService.updateBillingSettings(userId, settings)
        ));
    }
    
    @PutMapping("/integrations")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.IntegrationSettings>> updateIntegrationSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody AccountSettingsDTO.IntegrationSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Integration settings updated",
            accountSettingsService.updateIntegrationSettings(userId, settings)
        ));
    }
} 