package com.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.server.dto.StoreDTO;
import com.server.entity.Store;
import com.server.service.StoreService;
import com.server.util.ApiResponse;
import com.server.exception.ResourceNotFoundException;
import com.server.exception.UnauthorizedException;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    private static final Logger logger = LoggerFactory.getLogger(StoreController.class);

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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Store>> createStore(@RequestBody StoreDTO storeDTO) {
        try {
            // Get the authenticated user's details
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated", null));
            }

            // Get user details from Principal
            Object principal = authentication.getPrincipal();
            String ownerEmail;
            String ownerId = authentication.getName();

            // Handle different types of Principal objects
            if (principal instanceof UserDetails) {
                ownerEmail = ((UserDetails) principal).getUsername();
            } else if (principal instanceof OAuth2User) {
                ownerEmail = ((OAuth2User) principal).getAttribute("email");
            } else {
                ownerEmail = principal.toString();
            }

            // Validate owner email
            if (ownerEmail == null || ownerEmail.isEmpty()) {
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Invalid owner email", null));
            }

            // Set owner details in DTO
            storeDTO.setOwnerEmail(ownerEmail);
            storeDTO.setOwnerId(ownerId);

            // Create store
            Store createdStore = storeService.createStore(storeDTO);
            
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Store created successfully", createdStore));
        } catch (Exception e) {
            logger.error("Error creating store: ", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create store: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{storeId}/stats")
    @PreAuthorize("isAuthenticated() and @storeSecurityService.isStoreOwner(#storeId, principal)")
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

    @GetMapping("/{storeId}")
    public ResponseEntity<ApiResponse<Store>> getStoreById(@PathVariable String storeId) {
        try {
            Store store = storeService.getStoreById(storeId);
            return ResponseEntity.ok(ApiResponse.success("Store retrieved successfully", store));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Store not found", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve store", null));
        }
    }

    @PutMapping("/{storeId}")
    @PreAuthorize("isAuthenticated() and @storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Store>> updateStore(
            @PathVariable String storeId,
            @RequestBody StoreDTO storeDTO) {
        try {
            Store updatedStore = storeService.updateStore(storeId, storeDTO);
            return ResponseEntity.ok(ApiResponse.success("Store updated successfully", updatedStore));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Store not found", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update store", null));
        }
    }

    @DeleteMapping("/{storeId}")
    @PreAuthorize("isAuthenticated() and @storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteStore(@PathVariable String storeId) {
        try {
            storeService.deleteStore(storeId);
            return ResponseEntity.ok(ApiResponse.success("Store deleted successfully", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Store not found", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete store", null));
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

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        try {
            List<String> categories = storeService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve categories", null));
        }
    }

    @GetMapping("/owner/stores")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Store>>> getOwnerStores() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String ownerEmail = authentication.getName();
            List<Store> stores = storeService.getStoresByOwner(ownerEmail);
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
            String ownerEmail = authentication.getName();
            
            try {
                Store store = storeService.getCurrentStoreByOwner(ownerEmail);
                return ResponseEntity.ok(ApiResponse.success("Current store retrieved successfully", store));
            } catch (ResourceNotFoundException e) {
                return ResponseEntity.ok(ApiResponse.success("No stores found", null));
            }
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
            // Get authenticated user's email
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Store store = storeService.switchStore(storeId, userEmail);
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
}