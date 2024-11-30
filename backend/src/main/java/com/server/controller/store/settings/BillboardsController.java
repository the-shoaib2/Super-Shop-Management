package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.Billboard;
import com.server.service.store.settings.BillboardService;
import com.server.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}/billboards")
@RequiredArgsConstructor
public class BillboardsController {
    private final BillboardService billboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Billboard>>> getBillboards(@PathVariable String storeId) {
        try {
            billboardService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Billboards retrieved successfully",
                billboardService.getBillboards()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve billboards: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Billboard>> createBillboard(
            @PathVariable String storeId,
            @RequestBody Billboard billboard) {
        try {
            billboardService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Billboard created successfully",
                billboardService.createBillboard(billboard)
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create billboard: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{billboardId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteBillboard(
            @PathVariable String storeId,
            @PathVariable String billboardId) {
        try {
            billboardService.setCurrentStore(storeId);
            billboardService.deleteBillboard(billboardId);
            return ResponseEntity.ok(ApiResponse.success("Billboard deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete billboard: " + e.getMessage(), null));
        }
    }
}
