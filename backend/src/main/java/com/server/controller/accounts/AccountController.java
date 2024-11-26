package com.server.controller.accounts;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.server.model.accounts.Owner;
import com.server.service.accounts.AccountService;
import com.server.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {
    
    private final AccountService accountService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Owner>> getAccount(@AuthenticationPrincipal String userId) {
        return ResponseEntity.ok(ApiResponse.success(
            "Account retrieved successfully",
            accountService.getAccount(userId)
        ));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Owner>> updateAccount(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody Owner.AccountSettings settings) {
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
} 