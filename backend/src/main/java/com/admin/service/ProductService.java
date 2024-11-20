package com.admin.service;

import com.admin.model.Product;
import com.admin.repository.ProductRepository;
import com.admin.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByStore(String storeId) {
        return productRepository.findByStoreId(storeId);
    }

    public Product getProduct(String id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    public List<Product> getLowStockProducts(String storeId, int threshold) {
        return productRepository.findLowStockProducts(storeId, threshold);
    }

    public List<Product> getAvailableProducts(String storeId) {
        return productRepository.findAvailableProductsByStoreId(storeId);
    }
} 