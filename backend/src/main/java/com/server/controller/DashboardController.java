package com.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import com.server.service.AnalyticsService;
import com.server.util.ApiResponse;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    private static final Logger logger = LoggerFactory.getLogger(DashboardController.class);
    
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/stats/{storeId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreStats(@PathVariable String storeId) {
        try {
            logger.info("Fetching stats for store: {}", storeId);
            Map<String, Object> stats = analyticsService.getStoreAnalytics(storeId);
            return ResponseEntity.ok(ApiResponse.success("Stats retrieved successfully", stats));
        } catch (Exception e) {
            logger.error("Error fetching stats for store {}: {}", storeId, e.getMessage());
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve stats: " + e.getMessage(), null));
        }
    }
} 