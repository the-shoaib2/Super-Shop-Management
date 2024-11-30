package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.products.ProductColor;
import com.server.service.store.settings.ColorService;
import com.server.util.ApiResponse;
import com.server.exception.common.ResourceNotFoundException;
import com.server.exception.store.ColorOperationException;
import com.server.repository.store.StoreRepository;
import com.server.model.store.Store;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/stores/{storeId}/colors")
@RequiredArgsConstructor
public class ColorsController {
    private static final Logger logger = LoggerFactory.getLogger(ColorsController.class);
    private final ColorService colorService;
    private final StoreRepository storeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductColor>>> getColors(@PathVariable String storeId) {
        try {
            Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
                
            return ResponseEntity.ok(ApiResponse.success(
                "Colors retrieved successfully",
                store.getColors()
            ));
        } catch (ResourceNotFoundException e) {
            logger.error("Store not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Failed to retrieve colors for store {}: {}", storeId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve colors: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<ProductColor>> createColor(
            @PathVariable String storeId,
            @RequestBody ProductColor color) {
        try {
            logger.debug("Creating color for store {}: {}", storeId, color);
            
            Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
            
            // Set store reference
            color.setStore(store);
            
            ProductColor createdColor = colorService.createColor(color);
            
            // Update store's colors list
            store.getColors().add(createdColor);
            storeRepository.save(store);
            
            return ResponseEntity.ok(ApiResponse.success(
                "Color created successfully",
                createdColor
            ));
        } catch (IllegalArgumentException e) {
            logger.error("Validation error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (ResourceNotFoundException e) {
            logger.error("Store not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (ColorOperationException e) {
            logger.error("Color operation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Failed to create color for store {}: {}", storeId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create color: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{colorId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteColor(
            @PathVariable String storeId,
            @PathVariable String colorId) {
        try {
            logger.debug("Deleting color {} for store {}", colorId, storeId);
            
            Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
            
            // Remove color from store's colors list
            store.getColors().removeIf(c -> c.getId().equals(colorId));
            storeRepository.save(store);
            
            // Delete the color
            colorService.deleteColor(colorId);
            
            return ResponseEntity.ok(ApiResponse.success("Color deleted successfully", null));
        } catch (ResourceNotFoundException e) {
            logger.error("Color or store not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage(), null));
        } catch (Exception e) {
            logger.error("Failed to delete color {} for store {}: {}", colorId, storeId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to delete color: " + e.getMessage(), null));
        }
    }
}
