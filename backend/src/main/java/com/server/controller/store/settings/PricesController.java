package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

import com.server.model.store.Price;
import com.server.dto.store.PriceDTO;
import com.server.service.store.settings.PriceService;
import com.server.util.ApiResponse;

@RestController
@RequestMapping("/api/stores/{storeId}/prices")
@RequiredArgsConstructor
public class PricesController {
    private final PriceService priceService;

    @GetMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<List<Price>>> getPrices(@PathVariable String storeId) {
        try {
            priceService.setCurrentStore(storeId);
            List<Price> prices = priceService.getPrices();
            return ResponseEntity.ok(ApiResponse.success("Prices retrieved successfully", prices));
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
            price.setStoreId(storeId);
            Price created = priceService.createPrice(price);
            return ResponseEntity.ok(ApiResponse.success("Price created successfully", created));
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
            price.setStoreId(storeId);
            Price updated = priceService.updatePrice(price);
            return ResponseEntity.ok(ApiResponse.success("Price updated successfully", updated));
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
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Price>> getPrice(
            @PathVariable String storeId,
            @PathVariable String priceId) {
        try {
            priceService.setCurrentStore(storeId);
            Price price = priceService.getPrice(priceId);
            return ResponseEntity.ok(ApiResponse.success("Price retrieved successfully", price));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve price: " + e.getMessage(), null));
        }
    }

    @PostMapping("/{priceId}/discount")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Price>> addDiscount(
            @PathVariable String storeId,
            @PathVariable String priceId,
            @RequestBody Map<String, Object> discountInfo) {
        try {
            priceService.setCurrentStore(storeId);
            Price price = priceService.getPrice(priceId);
            
            String currencyCode = (String) discountInfo.get("currencyCode");
            Integer percentage = (Integer) discountInfo.get("percentage");
            LocalDateTime endDate = LocalDateTime.parse((String) discountInfo.get("endDate"));
            String type = (String) discountInfo.get("type");
            
            price.setDiscount(currencyCode, percentage, endDate, type);
            Price updated = priceService.updatePrice(price);
            
            return ResponseEntity.ok(ApiResponse.success("Discount added successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to add discount: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{priceId}/discount/{currencyCode}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Price>> removeDiscount(
            @PathVariable String storeId,
            @PathVariable String priceId,
            @PathVariable String currencyCode) {
        try {
            priceService.setCurrentStore(storeId);
            Price price = priceService.getPrice(priceId);
            price.removeDiscount(currencyCode);
            Price updated = priceService.updatePrice(price);
            return ResponseEntity.ok(ApiResponse.success("Discount removed successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to remove discount: " + e.getMessage(), null));
        }
    }

    @GetMapping("/products/{productId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<List<Price>>> getPricesForProduct(
            @PathVariable String storeId,
            @PathVariable String productId) {
        try {
            priceService.setCurrentStore(storeId);
            List<Price> prices = priceService.getPricesByProduct(productId);
            return ResponseEntity.ok(ApiResponse.success("Product prices retrieved successfully", prices));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve product prices: " + e.getMessage(), null));
        }
    }

    @GetMapping("/active")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<List<Price>>> getActivePrices(@PathVariable String storeId) {
        try {
            priceService.setCurrentStore(storeId);
            List<Price> prices = priceService.getActivePrices();
            return ResponseEntity.ok(ApiResponse.success("Active prices retrieved successfully", prices));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve active prices: " + e.getMessage(), null));
        }
    }

    @GetMapping("/discounted")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<List<Price>>> getDiscountedPrices(@PathVariable String storeId) {
        try {
            priceService.setCurrentStore(storeId);
            List<Price> prices = priceService.getDiscountedPrices();
            return ResponseEntity.ok(ApiResponse.success("Discounted prices retrieved successfully", prices));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve discounted prices: " + e.getMessage(), null));
        }
    }
}
