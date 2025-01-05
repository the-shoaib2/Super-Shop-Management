package com.server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ComponentScan;

@Configuration
@ComponentScan(basePackages = {
    "com.server.service.storage",
    "com.server.service.storage.impl"
})
public class FileStorageConfig {
    @Value("${file.storage.base-url/uploads")
    private String baseUrl;

    public String getBaseUrl() {
        return baseUrl;
    }
}