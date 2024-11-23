package com.server.controller;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.server.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AnalyticsService analyticsService;

    @GetMapping("/stats/{storeId}")
    public ResponseEntity<?> getStoreStats(@PathVariable String storeId) {
        try {
            Map<String, Object> stats = analyticsService.getStoreAnalytics(storeId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", stats
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "message", "Failed to fetch store stats: " + e.getMessage()
                ));
        }
    }

    @GetMapping("/sales")
    public ResponseEntity<?> getSalesReport(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        try {
            Map<String, Object> salesData = analyticsService.getSalesReport(start, end);
            return ResponseEntity.ok(salesData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of(
                    "success", false,
                    "message", "Failed to fetch sales report: " + e.getMessage()
                ));
        }
    }
} 