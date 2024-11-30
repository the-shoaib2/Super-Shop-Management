package com.server.repository.store.products;

import org.springframework.stereotype.Repository;
import com.server.model.store.products.ProductColor;
import com.server.repository.store.base.StoreBaseRepository;
import java.util.List;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface ProductColorRepository extends StoreBaseRepository<ProductColor, String> {
    @Query("{ 'storeId': ?0 }")
    List<ProductColor> findByStoreId(String storeId);

    Page<ProductColor> findByStoreId(String storeId, Pageable pageable);
} 