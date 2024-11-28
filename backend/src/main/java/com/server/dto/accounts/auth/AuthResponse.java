package com.server.dto.accounts.auth;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String userId;
    private String email;
    private String fullName;
    private String currentStoreId;
    private LocalDateTime loginTime;
    private boolean isStoreCreated;
} 