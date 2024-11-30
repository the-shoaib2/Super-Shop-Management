package com.server.repository.store.base;

import org.springframework.data.repository.NoRepositoryBean;
import com.server.repository.base.BaseRepository;
import java.util.List;

@NoRepositoryBean
public interface StoreBaseRepository<T, ID> extends BaseRepository<T, ID> {
    List<T> findByStoreId(String storeId);
} 