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
@RequestMapping("/api/{storeId}/sizes")
@RequiredArgsConstructor
public class SizesController {
    private final SizeService sizeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductSize>>> getSizes(@PathVariable String storeId) {
        sizeService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Sizes retrieved successfully",
            sizeService.getSizes()
        ));
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<ProductSize>> createSize(
            @PathVariable String storeId,
            @RequestBody ProductSize size) {
        sizeService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Size created successfully",
            sizeService.createSize(size)
        ));
    }

    @DeleteMapping("/{sizeId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteSize(
            @PathVariable String storeId,
            @PathVariable String sizeId) {
        sizeService.setCurrentStore(storeId);
        sizeService.deleteSize(sizeId);
        return ResponseEntity.ok(ApiResponse.success("Size deleted successfully", null));
    }
}
