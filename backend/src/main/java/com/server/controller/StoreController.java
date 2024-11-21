package com.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.dto.StoreDTO;
import com.server.entity.Store;
import com.server.service.StoreService;
import com.server.util.ApiResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/stores")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StoreController {
    @Autowired
    private StoreService storeService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Store>>> getAllStores(Pageable pageable) {
        try {
            return ResponseEntity
                    .ok(ApiResponse.success("Stores retrieved successfully", storeService.getAllStores(pageable)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve stores", null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Store>> createStore(@RequestBody StoreDTO storeDTO) {
        try {
            Store createdStore = storeService.createStore(storeDTO);
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Store created successfully", createdStore));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create store: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{storeId}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreStats(@PathVariable String storeId) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Store stats retrieved", storeService.getStoreStats(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve store stats", null));
        }
    }

    @GetMapping("/{storeId}/analytics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreAnalytics(@PathVariable String storeId) {
        try {
            return ResponseEntity
                    .ok(ApiResponse.success("Store analytics retrieved", storeService.getStoreAnalytics(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve store analytics", null));
        }
    }

    @GetMapping("/{storeId}/analytics/sales")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreSalesAnalytics(@PathVariable String storeId) {
        try {
            return ResponseEntity
                    .ok(ApiResponse.success("Sales analytics retrieved", storeService.getStoreSalesAnalytics(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve sales analytics", null));
        }
    }

    @GetMapping("/{storeId}/analytics/customers")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreCustomersAnalytics(@PathVariable String storeId) {
        try {
            return ResponseEntity.ok(
                    ApiResponse.success("Customer analytics retrieved",
                            storeService.getStoreCustomersAnalytics(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve customer analytics", null));
        }
    }

    @GetMapping("/{storeId}/analytics/products")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreProductsAnalytics(@PathVariable String storeId) {
        try {
            return ResponseEntity.ok(
                    ApiResponse.success("Product analytics retrieved",
                            storeService.getStoreProductsAnalytics(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve product analytics", null));
        }
    }

    @GetMapping("/{storeId}/analytics/inventory")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreInventoryAnalytics(@PathVariable String storeId) {
        try {
            return ResponseEntity.ok(
                    ApiResponse.success("Inventory analytics retrieved",
                            storeService.getStoreInventoryAnalytics(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve inventory analytics", null));
        }
    }
    
    
    @GetMapping("/{storeId}/analytics/reviews")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreReviewsAnalytics(@PathVariable String storeId) {
        try {
            return ResponseEntity.ok(
                    ApiResponse.success("Review analytics retrieved", storeService.getStoreReviewsAnalytics(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve review analytics", null));
        }
    }
}