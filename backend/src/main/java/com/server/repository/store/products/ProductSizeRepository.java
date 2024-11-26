package com.server.repository.store.products;

import org.springframework.stereotype.Repository;
import com.server.model.store.products.ProductSize;
import com.server.repository.store.base.StoreBaseRepository;
import java.util.List;

@Repository
public interface ProductSizeRepository extends StoreBaseRepository<ProductSize, String> {
    List<ProductSize> findByProductId(String productId);
    List<ProductSize> findByStoreId(String storeId);
} 