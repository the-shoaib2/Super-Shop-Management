package com.server.controller.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.server.model.store.products.Product;
import com.server.service.store.settings.ProductService;
import com.server.util.ApiResponse;
import com.server.exception.store.StoreRequirementException;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductsController {
    @Autowired
    private final ProductService productService;

    // Get all products (no store filter)
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve products: " + e.getMessage(), null));
        }
    }

    // Create a product (no store specified)
    @PostMapping("/products")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Product created successfully",
                productService.createProduct(product)));
        } catch (StoreRequirementException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Store requirements not met: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create product: " + e.getMessage(), null));
        }
    }

    // Get products by store
    @GetMapping("/stores/{storeId}/products")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsByStore(@PathVariable String storeId) {
        try {
            productService.setCurrentStore(storeId);
            List<Product> products = productService.getProductsByStore(storeId);
            return ResponseEntity.ok(ApiResponse.success("Store products retrieved successfully", products));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve store products: " + e.getMessage(), null));
        }
    }

    // Create product for specific store
    @PostMapping("/stores/{storeId}/products")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Product>> createStoreProduct(
            @PathVariable String storeId,
            @RequestBody Product product) {
        try {
            product.setStoreId(storeId);
            productService.setCurrentStore(storeId);
            
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.ok(ApiResponse.success("Product created successfully", createdProduct));
        } catch (StoreRequirementException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Store requirements not met: " + e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to create product: " + e.getMessage(), null));
        }
    }

    // Get single product
    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully",
                productService.getProduct(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve product: " + e.getMessage(), null));
        }
    }

    // Delete product
    @DeleteMapping("/products/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to delete product", null));
        }
    }

    // Update product
    @PutMapping("/products/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable String id,
            @RequestBody Product product) {
        try {
            product.setId(id);
            Product updated = productService.updateProduct(product);
            return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to update product", null));
        }
    }
}