package com.server.controller.accounts;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.server.service.accounts.AccountService;
import com.server.model.store.StoreOwner;
import com.server.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    
    private final AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StoreOwner>> getAccount(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Account retrieved successfully",
            accountService.getAccount(userId)
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StoreOwner>> updateAccount(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Account updated successfully",
            accountService.updateAccount(userId, settings)
        ));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@AuthenticationPrincipal String userId) {
        accountService.deleteAccount(userId);
        return ResponseEntity.ok(ApiResponse.success(
            "Account deleted successfully",
            null
        ));
    }

    // General Settings
    @PutMapping("/me/general")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updateGeneralSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "General settings updated",
            accountService.updateGeneralSettings(userId, settings)
        ));
    }

    // Security Settings
    @PutMapping("/me/security")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updateSecuritySettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Security settings updated",
            accountService.updateSecuritySettings(userId, settings)
        ));
    }

    // Notification Settings
    @PutMapping("/me/notifications")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updateNotificationSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Notification settings updated",
            accountService.updateNotificationSettings(userId, settings)
        ));
    }

    // Appearance Settings
    @PutMapping("/me/appearance")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updateAppearanceSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Appearance settings updated",
            accountService.updateAppearanceSettings(userId, settings)
        ));
    }

    // Language Settings
    @PutMapping("/me/language")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updateLanguageSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Language settings updated",
            accountService.updateLanguageSettings(userId, settings)
        ));
    }

    // Privacy Settings
    @PutMapping("/me/privacy")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updatePrivacySettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Privacy settings updated",
            accountService.updatePrivacySettings(userId, settings)
        ));
    }

    // Billing Settings
    @PutMapping("/me/billing")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updateBillingSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Billing settings updated",
            accountService.updateBillingSettings(userId, settings)
        ));
    }

    // Integration Settings
    @PutMapping("/me/integrations")
    public ResponseEntity<ApiResponse<StoreOwner.AccountSettings>> updateIntegrationSettings(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody StoreOwner.AccountSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Integration settings updated",
            accountService.updateIntegrationSettings(userId, settings)
        ));
    }
} 