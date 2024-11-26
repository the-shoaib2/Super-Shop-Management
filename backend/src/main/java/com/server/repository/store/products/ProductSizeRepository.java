package com.server.repository.store.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.server.model.store.products.ProductSize;

import java.util.List;

@Repository
public interface ProductSizeRepository extends MongoRepository<ProductSize, String> {
    List<ProductSize> findByProductId(String productId);
    List<ProductSize> findByStoreId(String storeId);
} 