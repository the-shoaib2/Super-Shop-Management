package com.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.server.model.store.products.ProductColor;

import java.util.List;

@Repository
public interface ProductColorRepository extends MongoRepository<ProductColor, String> {
    List<ProductColor> findByProductId(String productId);
    List<ProductColor> findByStoreId(String storeId);
} 