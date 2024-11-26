package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.products.ProductColor;
import com.server.service.store.settings.ColorService;
import com.server.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/{storeId}/colors")
@RequiredArgsConstructor
public class ColorsController {
    private final ColorService colorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductColor>>> getColors(@PathVariable String storeId) {
        colorService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Colors retrieved successfully",
            colorService.getColors()
        ));
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<ProductColor>> createColor(
            @PathVariable String storeId,
            @RequestBody ProductColor color) {
        colorService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Color created successfully",
            colorService.createColor(color)
        ));
    }

    @DeleteMapping("/{colorId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteColor(
            @PathVariable String storeId,
            @PathVariable String colorId) {
        colorService.setCurrentStore(storeId);
        colorService.deleteColor(colorId);
        return ResponseEntity.ok(ApiResponse.success("Color deleted successfully", null));
    }
}
