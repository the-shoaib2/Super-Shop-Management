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
@RequestMapping("/api/{storeId}/billboards")
@RequiredArgsConstructor
public class BillboardsController {
    private final BillboardService billboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Billboard>>> getBillboards(@PathVariable String storeId) {
        billboardService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Billboards retrieved successfully", 
            billboardService.getBillboards()
        ));
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Billboard>> createBillboard(
            @PathVariable String storeId,
            @RequestBody Billboard billboard) {
        billboardService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Billboard created successfully",
            billboardService.createBillboard(billboard)
        ));
    }

    @DeleteMapping("/{billboardId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteBillboard(
            @PathVariable String storeId,
            @PathVariable String billboardId) {
        billboardService.setCurrentStore(storeId);
        billboardService.deleteBillboard(billboardId);
        return ResponseEntity.ok(ApiResponse.success("Billboard deleted successfully", null));
    }
}
