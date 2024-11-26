package com.server.dto.response.auth;

import lombok.Data;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private UserDTO user;
    private LocalDateTime loginTime;

    @Data
    public static class UserDTO {
        private String email;
        private String fullName;
        private String role;
    }
} 