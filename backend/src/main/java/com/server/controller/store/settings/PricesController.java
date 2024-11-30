package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.Price;
import com.server.service.store.settings.PriceService;
import com.server.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}/prices")
@RequiredArgsConstructor
public class PricesController {
    private final PriceService priceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Price>>> getPrices(@PathVariable String storeId) {
        try {
            priceService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Prices retrieved successfully",
                priceService.getPrices()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve prices: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Price>> createPrice(
            @PathVariable String storeId,
            @RequestBody Price price) {
        try {
            priceService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Price created successfully",
                priceService.createPrice(price)
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create price: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{priceId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Price>> updatePrice(
            @PathVariable String storeId,
            @PathVariable String priceId,
            @RequestBody Price price) {
        try {
            priceService.setCurrentStore(storeId);
            price.setId(priceId);
            return ResponseEntity.ok(ApiResponse.success(
                "Price updated successfully",
                priceService.updatePrice(price)
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update price: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{priceId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deletePrice(
            @PathVariable String storeId,
            @PathVariable String priceId) {
        try {
            priceService.setCurrentStore(storeId);
            priceService.deletePrice(priceId);
            return ResponseEntity.ok(ApiResponse.success("Price deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete price: " + e.getMessage(), null));
        }
    }

    @GetMapping("/{priceId}")
    public ResponseEntity<ApiResponse<Price>> getPrice(
            @PathVariable String storeId,
            @PathVariable String priceId) {
        try {
            priceService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Price retrieved successfully",
                priceService.getPrice(priceId)
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve price: " + e.getMessage(), null));
        }
    }
}
