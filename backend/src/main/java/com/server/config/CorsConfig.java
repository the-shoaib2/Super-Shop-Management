package com.server.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${admin.frontend.url}")
    private String adminFrontendUrl;

    @Value("${store.frontend.url}")
    private String storeFrontendUrl;

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    adminFrontendUrl,    // Admin frontend
                    storeFrontendUrl,    // Store frontend
                    "http://localhost:8080"  // Backend API
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders(
                    "Authorization",
                    "Content-Type",
                    "Accept",
                    "Origin",
                    "X-Requested-With",
                    "Access-Control-Request-Method",
                    "Access-Control-Request-Headers"
                )
                .exposedHeaders(
                    "Authorization",
                    "Access-Control-Allow-Origin",
                    "Access-Control-Allow-Credentials"
                )
                .allowCredentials(true)
                .maxAge(3600);
    }
}
