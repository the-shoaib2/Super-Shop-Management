package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.products.ProductSize;
import com.server.service.store.settings.SizeService;
import com.server.util.ApiResponse;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stores/{storeId}/sizes")
@RequiredArgsConstructor
public class SizesController {
    private final SizeService sizeService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ProductSize>>> getSizes(@PathVariable String storeId) {
        try {
            List<ProductSize> sizes = sizeService.getSizes(storeId);
            return ResponseEntity.ok(ApiResponse.success("Sizes retrieved successfully", sizes));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve sizes: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProductSize>> createSize(
            @PathVariable String storeId,
            @Valid @RequestBody ProductSize size) {
        try {
            size.setStoreId(storeId);
            ProductSize created = sizeService.createSize(size);
            return ResponseEntity.ok(ApiResponse.success("Size created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create size: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{sizeId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProductSize>> updateSize(
            @PathVariable String storeId,
            @PathVariable String sizeId,
            @Valid @RequestBody ProductSize size) {
        try {
            size.setId(sizeId);
            size.setStoreId(storeId);
            ProductSize updated = sizeService.updateSize(size);
            return ResponseEntity.ok(ApiResponse.success("Size updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update size: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{sizeId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteSize(
            @PathVariable String storeId,
            @PathVariable String sizeId) {
        try {
            sizeService.deleteSize(sizeId);
            return ResponseEntity.ok(ApiResponse.success("Size deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete size: " + e.getMessage(), null));
        }
    }
}
