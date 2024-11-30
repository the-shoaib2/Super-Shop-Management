package com.server.repository.store.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.server.model.store.products.ProductSize;
import java.util.List;

public interface ProductSizeRepository extends MongoRepository<ProductSize, String> {
    List<ProductSize> findByStoreId(String storeId);
} 