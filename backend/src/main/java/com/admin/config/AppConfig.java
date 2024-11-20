package com.admin.config;

import com.admin.util.TokenUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    
    @Bean
    public TokenUtil tokenUtil() {
        return new TokenUtil();
    }
} 