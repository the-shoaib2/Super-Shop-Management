package com.server.repository.store.products;

import org.springframework.stereotype.Repository;
import com.server.model.store.products.ProductColor;
import com.server.repository.store.base.StoreBaseRepository;
import java.util.List;

@Repository
public interface ProductColorRepository extends StoreBaseRepository<ProductColor, String> {
    List<ProductColor> findByProductId(String productId);
    List<ProductColor> findByStoreId(String storeId);
} 