package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.products.ProductSize;
import com.server.service.store.settings.SizeService;
import com.server.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}/sizes")
@RequiredArgsConstructor
public class SizesController {
    private final SizeService sizeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductSize>>> getSizes(@PathVariable String storeId) {
        try {
            sizeService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Sizes retrieved successfully",
                sizeService.getSizes()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve sizes: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<ProductSize>> createSize(
            @PathVariable String storeId,
            @RequestBody ProductSize size) {
        try {
            sizeService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Size created successfully",
                sizeService.createSize(size)
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create size: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{sizeId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteSize(
            @PathVariable String storeId,
            @PathVariable String sizeId) {
        try {
            sizeService.setCurrentStore(storeId);
            sizeService.deleteSize(sizeId);
            return ResponseEntity.ok(ApiResponse.success("Size deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete size: " + e.getMessage(), null));
        }
    }
}
