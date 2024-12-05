package com.server.service.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.products.Product;
import com.server.model.store.Store;
import com.server.repository.store.products.ProductRepository;
import com.server.repository.store.StoreRepository;
import com.server.service.store.base.StoreAwareService;
import com.server.service.store.StoreRequirementsService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService extends StoreAwareService {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
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
        // Validate store requirements
        storeRequirementsService.checkStoreRequirements(currentStoreId);
        
        // Ensure store ID is set
        if (product.getStoreId() == null) {
            product.setStoreId(currentStoreId);
        }
        
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        
        Product savedProduct = productRepository.save(product);
        
        // Update store's products list
        Store store = storeRepository.findById(currentStoreId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + currentStoreId));
        
        if (store.getProducts() == null) {
            store.setProducts(new ArrayList<>());
        }
        store.getProducts().add(savedProduct);
        storeRepository.save(store);
        
        return savedProduct;
    }

    public void deleteProduct(String id) {
        Product product = getProduct(id);
        validateStore(product.getStoreId());
        productRepository.deleteById(id);
    }

    public Product updateProduct(Product product) {
        Product existingProduct = getProduct(product.getId());
        validateStore(existingProduct.getStoreId());
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
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