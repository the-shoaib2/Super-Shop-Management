package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.Category;
import com.server.service.store.settings.CategoryService;
import com.server.util.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/stores/{storeId}/categories")
@RequiredArgsConstructor
public class CategoriesController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getCategories(@PathVariable String storeId) {
        try {
            categoryService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Categories retrieved successfully",
                categoryService.getCategories()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve categories: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @PathVariable String storeId,
            @RequestBody Category category) {
        try {
            categoryService.setCurrentStore(storeId);
            return ResponseEntity.ok(ApiResponse.success(
                "Category created successfully",
                categoryService.createCategory(category)
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create category: " + e.getMessage(), null));
        }
    }
}
