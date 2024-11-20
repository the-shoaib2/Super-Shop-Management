package com.admin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {
    @Value("${jwt.access-secret}")
    private String accessSecret;
    
    @Value("${jwt.refresh-secret}")
    private String refreshSecret;
    
    @Value("${jwt.access-expiration}")
    private Long accessExpiration;
    
    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    // Getters
    public String getAccessSecret() {
        return accessSecret;
    }

    public String getRefreshSecret() {
        return refreshSecret;
    }

    public Long getAccessExpiration() {
        return accessExpiration;
    }

    public Long getRefreshExpiration() {
        return refreshExpiration;
    }
} 