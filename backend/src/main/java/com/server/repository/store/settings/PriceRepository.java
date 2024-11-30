package com.server.repository.store.settings;

import org.springframework.stereotype.Repository;
import com.server.model.store.Price;
import com.server.repository.store.base.StoreBaseRepository;
import java.util.List;

@Repository
public interface PriceRepository extends StoreBaseRepository<Price, String> {
    List<Price> findByStoreId(String storeId);
} 