package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Category>>> getCategories(@PathVariable String storeId) {
        try {
            categoryService.setCurrentStore(storeId);
            List<Category> categories = categoryService.getCategories();
            return ResponseEntity.ok(ApiResponse.success(
                "Categories retrieved successfully",
                categories
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to retrieve categories: " + e.getMessage(), null));
        }
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @PathVariable String storeId,
            @Valid @RequestBody Category category) {
        try {
            categoryService.setCurrentStore(storeId);
            Category created = categoryService.createCategory(category);
            return ResponseEntity.ok(ApiResponse.success(
                "Category created successfully",
                created
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to create category: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable String storeId,
            @PathVariable String categoryId,
            @Valid @RequestBody Category category) {
        try {
            categoryService.setCurrentStore(storeId);
            Category updated = categoryService.updateCategory(categoryId, category);
            return ResponseEntity.ok(ApiResponse.success(
                "Category updated successfully",
                updated
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to update category: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
            @PathVariable String storeId,
            @PathVariable String categoryId) {
        try {
            categoryService.setCurrentStore(storeId);
            categoryService.deleteCategory(categoryId);
            return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete category: " + e.getMessage(), null));
        }
    }
}
