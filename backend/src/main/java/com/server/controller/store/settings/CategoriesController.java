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
@RequestMapping("/api/{storeId}/categories")
@RequiredArgsConstructor
public class CategoriesController {
    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getCategories(@PathVariable String storeId) {
        categoryService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Categories retrieved successfully",
            categoryService.getCategories()
        ));
    }

    @PostMapping
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @PathVariable String storeId,
            @RequestBody Category category) {
        categoryService.setCurrentStore(storeId);
        return ResponseEntity.ok(ApiResponse.success(
            "Category created successfully",
            categoryService.createCategory(category)
        ));
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable String storeId,
            @PathVariable String categoryId) {
        categoryService.setCurrentStore(storeId);
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
