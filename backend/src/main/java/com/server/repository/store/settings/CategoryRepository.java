package com.server.repository.store.settings;

import org.springframework.stereotype.Repository;
import com.server.model.store.Category;
import com.server.repository.store.base.StoreBaseRepository;
import java.util.List;

@Repository
public interface CategoryRepository extends StoreBaseRepository<Category, String> {
    List<Category> findByStoreId(String storeId);
} 