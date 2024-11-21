package com.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.server.util.TokenUtil;

@Configuration
public class AppConfig {
    
    @Bean
    public TokenUtil tokenUtil() {
        return new TokenUtil();
    }
} 