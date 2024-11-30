package com.server.service.store.base;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BaseStoreEntityService<T> {
    List<T> findAllByStore(String storeId);
    T findById(String id);
    T create(T entity, String storeId);
    T update(String id, T entity);
    void delete(String id);
    Page<T> findAllByStorePaginated(String storeId, Pageable pageable);
} 