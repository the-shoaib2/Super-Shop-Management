package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

import com.server.model.store.products.ProductColor;
import com.server.service.store.settings.ColorService;
import com.server.util.ApiResponse;

import java.util.List;


@RestController
@RequestMapping("/api/stores/{storeId}/colors")
@RequiredArgsConstructor
public class ColorsController {
    private final ColorService colorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductColor>>> getColors(@PathVariable String storeId) {
        try {
            List<ProductColor> colors = colorService.findAllByStore(storeId);
            return ResponseEntity.ok(ApiResponse.success("Colors retrieved successfully", colors));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve colors: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<ProductColor>> createColor(
            @PathVariable String storeId,
            @Valid @RequestBody ProductColor color) {
        try {
            ProductColor created = colorService.create(color, storeId);
            return ResponseEntity.ok(ApiResponse.success("Color created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create color: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{colorId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<ProductColor>> updateColor(
            @PathVariable String storeId,
            @PathVariable String colorId,
            @Valid @RequestBody ProductColor color) {
        try {
            color.setId(colorId); // Ensure the ID is set for update
            ProductColor updated = colorService.update(storeId, color);
            return ResponseEntity.ok(ApiResponse.success("Color updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update color: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{colorId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteColor(
            @PathVariable String storeId,
            @PathVariable String colorId) {
        try {
            colorService.delete(colorId);
            return ResponseEntity.ok(ApiResponse.success("Color deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete color: " + e.getMessage(), null));
        }
    }
}
