package com.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.server.model.store.product.ProductSize;
import java.util.List;

@Repository
public interface ProductSizeRepository extends MongoRepository<ProductSize, String> {
    List<ProductSize> findByProductId(String productId);
    List<ProductSize> findByStoreId(String storeId);
} 