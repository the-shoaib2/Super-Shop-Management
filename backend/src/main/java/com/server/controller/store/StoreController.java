package com.server.controller.store;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.server.dto.StoreDTO;
import com.server.model.store.Store;
import com.server.util.ApiResponse;
import com.server.exception.ResourceNotFoundException;
import com.server.exception.UnauthorizedException;
import com.server.service.store.StoreService;
import com.server.service.analytics.AnalyticsService;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    private static final Logger logger = LoggerFactory.getLogger(StoreController.class);

    @Autowired
    private StoreService storeService;
    
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Store>>> getAllStores() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated", null));
            }

            List<Store> stores = storeService.getStoresByOwnerEmail(email);
            return ResponseEntity.ok(ApiResponse.success("Stores retrieved successfully", stores));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve stores: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Store>> createStore(@RequestBody StoreDTO storeDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated", null));
            }

            String ownerEmail = authentication.getName();
            storeDTO.setOwnerEmail(ownerEmail);

            Store createdStore = storeService.createStore(storeDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Store created successfully", createdStore));
        } catch (Exception e) {
            logger.error("Error creating store: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create store: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<ApiResponse<Store>> getStoreById(@PathVariable String storeId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            // Get owner's stores
            List<Store> ownerStores = storeService.getStoresByOwnerEmail(email);
            
            // Find the requested store in owner's stores
            Store store = ownerStores.stream()
                .filter(s -> s.getId().equals(storeId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Store not found or access denied"));
            
            return ResponseEntity.ok(ApiResponse.success("Store retrieved successfully", store));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve store", null));
        }
    }

    @GetMapping("/owner/stores")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Store>>> getOwnerStores() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            List<Store> stores = storeService.getStoresByOwnerEmail(email);
            return ResponseEntity.ok(ApiResponse.success("Owner stores retrieved successfully", stores));
        } catch (Exception e) {
            logger.error("Error retrieving owner stores: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve owner stores", null));
        }
    }

    @GetMapping("/owner/current")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Store>> getCurrentOwnerStore() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            Store store = storeService.getCurrentStoreByOwner(email);
            return ResponseEntity.ok(ApiResponse.success("Current store retrieved successfully", store));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.ok(ApiResponse.success("No stores found", null));
        } catch (Exception e) {
            logger.error("Error retrieving current store: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve current store: " + e.getMessage(), null));
        }
    }

    @PostMapping("/owner/stores/{storeId}/switch")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Store>> switchStore(@PathVariable String storeId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            Store store = storeService.switchStore(storeId, email);
            return ResponseEntity.ok(ApiResponse.success("Store switched successfully", store));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Store not found", null));
        } catch (UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to switch store: " + e.getMessage(), null));
        }
    }

    // Analytics endpoints
    @GetMapping("/{storeId}/stats")
    @PreAuthorize("isAuthenticated() and @storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStoreStats(@PathVariable String storeId) {
        try {
            return ResponseEntity.ok(ApiResponse.success(
                "Store stats retrieved", 
                analyticsService.getStoreAnalytics(storeId)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve store stats", null));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Store>>> searchStores(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) List<String> tags,
            Pageable pageable) {
        try {
            Page<Store> stores = storeService.searchStores(query, categories, tags, pageable);
            return ResponseEntity.ok(ApiResponse.success("Stores retrieved successfully", stores));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to search stores", null));
        }
    }
}