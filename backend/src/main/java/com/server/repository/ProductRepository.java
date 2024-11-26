package com.server.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.server.model.store.products.Product;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByStoreId(String storeId);
    
    @Query("{ 'storeId': ?0, 'isActive': true }")
    List<Product> findActiveProductsByStoreId(String storeId);
    
    @Query("{ 'storeId': ?0, 'quantity': { $lt: ?1 } }")
    List<Product> findLowStockProducts(String storeId, int threshold);
    
    @Query("{ 'storeId': ?0, 'quantity': { $gt: 0 } }")
    List<Product> findAvailableProductsByStoreId(String storeId);
    
    @Query("{ 'storeId': ?0, 'categoryId': ?1 }")
    List<Product> findByStoreIdAndCategoryId(String storeId, String categoryId);
} 