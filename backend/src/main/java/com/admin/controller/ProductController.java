package com.admin.controller;

import com.admin.model.Product;
import com.admin.service.ProductService;
import com.admin.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    @Autowired
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts() {
        try {
            return ResponseEntity.ok(ApiResponse.success("Products retrieved successfully", 
                productService.getAllProducts()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Failed to retrieve products", null));
        }
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<ApiResponse<List<Product>>> getProductsByStore(@PathVariable String storeId) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Store products retrieved successfully",
                productService.getProductsByStore(storeId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Failed to retrieve store products", null));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully",
                productService.getProduct(id)));
        }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        try {
            return ResponseEntity.ok(ApiResponse.success("Product created successfully",
                productService.createProduct(product)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Failed to create product", null));
        }
    }

    @DeleteMapping("/{id}") 
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("Failed to delete product", null));
        }
    }
}