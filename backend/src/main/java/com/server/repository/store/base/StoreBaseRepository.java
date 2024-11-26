package com.server.repository.store.base;

import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.mongodb.repository.Query;
import com.server.repository.base.BaseRepository;
import java.util.List;

@NoRepositoryBean
public interface StoreBaseRepository<T, ID> extends BaseRepository<T, ID> {
    @Query("{ 'storeId': ?0 }")
    List<T> findByStoreId(String storeId);
} 