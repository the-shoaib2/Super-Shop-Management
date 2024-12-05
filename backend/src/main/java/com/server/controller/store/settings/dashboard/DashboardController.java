package com.server.controller.store.settings.dashboard;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.validation.annotation.Validated;

import com.server.service.analytics.AnalyticsService;
import com.server.exception.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/store/{storeId}/dashboard")
@RequiredArgsConstructor
@Validated
public class DashboardController {

    private final AnalyticsService analyticsService;

    @GetMapping("/stats")
    @Cacheable(value = "storeStats", key = "#storeId")
    public ResponseEntity<Map<String, Object>> getStoreStats(@PathVariable String storeId) {
        try {
            Map<String, Object> stats = analyticsService.getStoreAnalytics(storeId);
            return ResponseEntity.ok(createSuccessResponse(stats));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch store stats", e.getMessage()));
        }
    }

    @GetMapping("/sales")
    @Cacheable(value = "salesReport", key = "#storeId + #start + #end")
    public ResponseEntity<Map<String, Object>> getSalesReport(
        @PathVariable String storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        try {
            validateDateRange(start, end);
            Map<String, Object> salesData = analyticsService.getSalesReport(start, end);
            return ResponseEntity.ok(createSuccessResponse(salesData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Invalid date range", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch sales report", e.getMessage()));
        }
    }

    @GetMapping("/product-stock")
    @Cacheable(value = "productStock", key = "#storeId")
    public ResponseEntity<Map<String, Object>> getProductStockAnalytics(@PathVariable String storeId) {
        try {
            Map<String, Object> stockData = analyticsService.getProductStockAnalytics(storeId);
            return ResponseEntity.ok(createSuccessResponse(stockData));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch product stock analytics", e.getMessage()));
        }
    }

    @GetMapping("/sales-trend")
    @Cacheable(value = "salesTrend", key = "#storeId + #start + #end")
    public ResponseEntity<Map<String, Object>> getSalesTrend(
        @PathVariable String storeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        try {
            validateDateRange(start, end);
            Map<String, Object> trendData = analyticsService.getSalesTrend(storeId, start, end);
            return ResponseEntity.ok(createSuccessResponse(trendData));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(createErrorResponse("Invalid date range", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch sales trend", e.getMessage()));
        }
    }

    @GetMapping("/category-analytics")
    @Cacheable(value = "categoryAnalytics", key = "#storeId")
    public ResponseEntity<Map<String, Object>> getCategoryAnalytics(@PathVariable String storeId) {
        try {
            Map<String, Object> categoryData = analyticsService.getCategoryAnalytics(storeId);
            return ResponseEntity.ok(createSuccessResponse(categoryData));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(createErrorResponse("Failed to fetch category analytics", e.getMessage()));
        }
    }

    private void validateDateRange(LocalDateTime start, LocalDateTime end) {
        if (start.isAfter(end)) {
            throw new IllegalArgumentException("Start date must be before end date");
        }
        if (start.isAfter(LocalDateTime.now()) || end.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("Date range cannot be in the future");
        }
    }

    private Map<String, Object> createSuccessResponse(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    private Map<String, Object> createErrorResponse(String message, String details) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("details", details);
        return response;
    }
}