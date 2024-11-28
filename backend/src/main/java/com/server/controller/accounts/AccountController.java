package com.server.controller.accounts;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.server.dto.accounts.AccountDTO;
import com.server.service.accounts.AccountService;
import com.server.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    
    private final AccountService accountService;
    
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AccountDTO>> getProfile(
            @AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Profile retrieved successfully",
            accountService.getProfile(userId)
        ));
    }
    
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<AccountDTO>> updateProfile(
            @AuthenticationPrincipal String userId,
            @RequestBody AccountDTO accountDTO) {
        return ResponseEntity.ok(ApiResponse.success(
            "Profile updated successfully",
            accountService.updateProfile(userId, accountDTO)
        ));
    }
} 