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
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import com.server.model.store.products.ProductColor;
import com.server.model.store.products.ProductSize;
import com.server.model.store.Billboard;
import com.server.model.store.Category;
import com.server.model.store.Price;
import com.server.service.store.settings.ColorService;
import com.server.service.store.settings.SizeService;
import com.server.service.store.settings.CategoryService;
import com.server.service.store.settings.BillboardService;
import com.server.service.store.settings.PriceService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductsController {
    @Autowired
    private final ProductService productService;

    @Autowired
    private ColorService colorService;

    @Autowired
    private SizeService sizeService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BillboardService billboardService;

    @Autowired
    private PriceService priceService;

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
            // Set store ID and current store context
            product.setStoreId(storeId);
            productService.setCurrentStore(storeId);
            
            // Set creation timestamp
            product.setCreatedAt(LocalDateTime.now());
            product.setUpdatedAt(LocalDateTime.now());
            
            // Validate references exist in the store
            validateProductReferences(product, storeId);
            
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

    // Delete product from specific store
    @DeleteMapping("/stores/{storeId}/products/{productId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Void>> deleteStoreProduct(
            @PathVariable String storeId,
            @PathVariable String productId) {
        try {
            // Set current store context
            productService.setCurrentStore(storeId);
            
            // Verify product belongs to store
            Product product = productService.getProduct(productId);
            if (!product.getStoreId().equals(storeId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Product does not belong to this store", null));
            }

            // Delete the product
            productService.deleteProduct(productId);
            
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to delete product: " + e.getMessage(), null));
        }
    }

    // Update product for specific store
    @PutMapping("/stores/{storeId}/products/{productId}")
    @PreAuthorize("@storeSecurityService.isStoreOwner(#storeId, principal)")
    public ResponseEntity<ApiResponse<Product>> updateStoreProduct(
            @PathVariable String storeId,
            @PathVariable String productId,
            @RequestBody Product product) {
        try {
            // Set current store context
            productService.setCurrentStore(storeId);
            
            // Verify product belongs to store
            Product existingProduct = productService.getProduct(productId);
            if (!existingProduct.getStoreId().equals(storeId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Product does not belong to this store", null));
            }

            // Set product ID, store ID and update timestamp
            product.setId(productId);
            product.setStoreId(storeId);
            product.setUpdatedAt(LocalDateTime.now());
            product.setCreatedAt(existingProduct.getCreatedAt());
            
            // Validate references exist in the store
            validateProductReferences(product, storeId);
            
            // Update the product
            Product updatedProduct = productService.updateProduct(product);
            
            return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updatedProduct));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to update product: " + e.getMessage(), null));
        }
    }

    // Delete product (generic)
    @DeleteMapping("/products/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        try {
            // Get product to verify ownership
            Product product = productService.getProduct(id);
            
            // Delete the product
            productService.deleteProduct(id);
            
            return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to delete product: " + e.getMessage(), null));
        }
    }

    // Update product (generic)
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
                .body(ApiResponse.error("Failed to update product: " + e.getMessage(), null));
        }
    }

    private void validateProductReferences(Product product, String storeId) {
        // Validate colors
        if (product.getColors() != null && !product.getColors().isEmpty()) {
            List<ProductColor> validatedColors = product.getColors().stream()
                .map(color -> colorService.findById(color.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Color not found: " + color.getId())))
                .peek(color -> {
                    if (!storeId.equals(color.getStoreId())) {
                        throw new IllegalArgumentException("Color " + color.getId() + " does not belong to store " + storeId);
                    }
                })
                .collect(Collectors.toList());
            product.setColors(validatedColors);
        }

        // Validate sizes
        if (product.getSizes() != null && !product.getSizes().isEmpty()) {
            List<ProductSize> validatedSizes = product.getSizes().stream()
                .map(size -> sizeService.findById(size.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Size not found: " + size.getId())))
                .peek(size -> {
                    if (!storeId.equals(size.getStoreId())) {
                        throw new IllegalArgumentException("Size " + size.getId() + " does not belong to store " + storeId);
                    }
                })
                .collect(Collectors.toList());
            product.setSizes(validatedSizes);
        }

        // Validate category
        if (product.getCategory() != null) {
            Category category = categoryService.findById(product.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + product.getCategory().getId()));
            if (!storeId.equals(category.getStoreId())) {
                throw new IllegalArgumentException("Category " + category.getId() + " does not belong to store " + storeId);
            }
            product.setCategory(category);
        }

        // Validate billboards
        if (product.getBillboards() != null && !product.getBillboards().isEmpty()) {
            List<Billboard> validatedBillboards = product.getBillboards().stream()
                .map(billboard -> billboardService.findById(billboard.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Billboard not found: " + billboard.getId())))
                .peek(billboard -> {
                    if (!storeId.equals(billboard.getStoreId())) {
                        throw new IllegalArgumentException("Billboard " + billboard.getId() + " does not belong to store " + storeId);
                    }
                })
                .collect(Collectors.toList());
            product.setBillboards(validatedBillboards);
        }

        // Validate prices
        if (product.getPrices() != null && !product.getPrices().isEmpty()) {
            List<Price> validatedPrices = product.getPrices().stream()
                .map(price -> priceService.getPrice(price.getId()))
                .peek(price -> {
                    if (!storeId.equals(price.getStoreId())) {
                        throw new IllegalArgumentException("Price " + price.getId() + " does not belong to store " + storeId);
                    }
                })
                .collect(Collectors.toList());
            product.setPrices(validatedPrices);
        }
    }
}