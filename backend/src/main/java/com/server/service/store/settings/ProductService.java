package com.server.service.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.products.Product;
import com.server.repository.store.products.ProductRepository;
import com.server.service.store.base.StoreAwareService;
import com.server.service.store.StoreRequirementsService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService extends StoreAwareService {
    private final ProductRepository productRepository;
    private final StoreRequirementsService storeRequirementsService;

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
        storeRequirementsService.checkStoreRequirements(currentStoreId);
        
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setStoreId(currentStoreId);
        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProduct(id);
        validateStore(product.getStoreId());
        productRepository.deleteById(id);
    }

    public List<Product> getLowStockProducts(String storeId, int threshold) {
        validateStore(storeId);
        return productRepository.findLowStockProducts(storeId, threshold);
    }

    public List<Product> getAvailableProducts(String storeId) {
        validateStore(storeId);
        return productRepository.findAvailableProductsByStoreId(storeId);
    }

    public List<Product> getProductsByCategory(String storeId, String categoryId) {
        validateStore(storeId);
        return productRepository.findByStoreIdAndCategoryId(storeId, categoryId);
    }
} 