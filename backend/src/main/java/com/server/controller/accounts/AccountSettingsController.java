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
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/me/settings")
@RequiredArgsConstructor
@Validated
public class AccountSettingsController {
    
    private final AccountSettingsService accountSettingsService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<AccountSettingsDTO>> getSettings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
            "Settings retrieved successfully",
            accountSettingsService.getSettings(userDetails.getUsername())
        ));
    }
    
    @PutMapping("/language")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.LanguageSettings>> updateLanguageSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AccountSettingsDTO.LanguageSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Language settings updated successfully",
            accountSettingsService.updateLanguageSettings(userDetails.getUsername(), settings)
        ));
    }
    
    @PutMapping("/appearance")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.AppearanceSettings>> updateAppearanceSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AccountSettingsDTO.AppearanceSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Appearance settings updated successfully",
            accountSettingsService.updateAppearanceSettings(userDetails.getUsername(), settings)
        ));
    }
    
    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse<AccountSettingsDTO.NotificationSettings>> updateNotificationSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AccountSettingsDTO.NotificationSettings settings) {
        return ResponseEntity.ok(ApiResponse.success(
            "Notification settings updated successfully",
            accountSettingsService.updateNotificationSettings(userDetails.getUsername(), settings)
        ));
    }
} 