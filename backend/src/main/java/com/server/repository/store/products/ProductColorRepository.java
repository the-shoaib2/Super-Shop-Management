package com.server.repository.store.products;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.server.model.store.products.ProductColor;
import java.util.List;
import java.util.Optional;

public interface ProductColorRepository extends MongoRepository<ProductColor, String> {
    List<ProductColor> findByStoreId(String storeId);
    Optional<ProductColor> findByIdAndStoreId(String id, String storeId);
} 