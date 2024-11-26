package com.server.repository.store;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.server.model.store.Store;
import com.server.repository.store.base.StoreBaseRepository;
import java.util.List;

@Repository
public interface StoreRepository extends StoreBaseRepository<Store, String> {
    @Query("{ 'ownerEmail': ?0 }")
    List<Store> findByOwnerEmail(String ownerEmail);
    
    @Query("{ 'ownerEmail': ?0, 'isActive': true }")
    List<Store> findActiveStoresByOwnerEmail(String email);
    
    @Query(value = "{ '_id': ?0 }", fields = "{ 'products': 1, 'colors': 1, 'sizes': 1, 'billboards': 1, 'storeCategories': 1 }")
    Store findStoreWithChildEntities(String storeId);
    
    @Query(value = "{ '_id': ?0 }", fields = "{ 'settings': 1 }")
    Store findStoreSettings(String storeId);
    
    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } } " +
           "], " +
           "'categories': { $in: ?1 }, " +
           "'tags': { $in: ?2 } }")
    Page<Store> findBySearchCriteria(String query, List<String> categories, List<String> tags, Pageable pageable);
} 