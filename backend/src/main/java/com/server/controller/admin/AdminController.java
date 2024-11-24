package com.server.controller.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.service.admin.AdminService;
import com.server.util.ApiResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        try {
            Map<String, Object> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve dashboard stats", null));
        }
    }

    @GetMapping("/stores")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoresOverview() {
        try {
            Map<String, Object> overview = adminService.getStoresOverview();
            return ResponseEntity.ok(ApiResponse.success("Stores overview retrieved", overview));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve stores overview", null));
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemAnalytics() {
        try {
            Map<String, Object> analytics = adminService.getSystemAnalytics();
            return ResponseEntity.ok(ApiResponse.success("System analytics retrieved", analytics));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve system analytics", null));
        }
    }
} 