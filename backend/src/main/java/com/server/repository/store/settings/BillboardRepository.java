package com.server.repository.store.settings;

import org.springframework.stereotype.Repository;
import com.server.model.store.Billboard;
import com.server.repository.store.base.StoreBaseRepository;
import java.util.List;

@Repository
public interface BillboardRepository extends StoreBaseRepository<Billboard, String> {
    List<Billboard> findByStoreId(String storeId);
} 