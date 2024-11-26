package com.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import com.server.model.store.Store;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends MongoRepository<Store, String> {
    
    // Basic queries
    Optional<Store> findByStoreId(String storeId);
    
    @Query("{ 'ownerId': ?0 }")
    List<Store> findByOwnerId(String ownerId);
    
    @Query("{ 'ownerEmail': ?0 }")
    List<Store> findByOwnerEmail(String ownerEmail);
    
    // Store with child entities
    @Query(value = "{ '_id': ?0 }", fields = "{ 'products': 1, 'colors': 1, 'sizes': 1, 'billboards': 1, 'storeCategories': 1 }")
    Store findStoreWithChildEntities(String storeId);
    
    // Active store queries
    @Query("{ 'ownerEmail': ?0, 'isActive': true }")
    List<Store> findActiveStoresByOwnerEmail(String email);
    
    // Store settings
    @Query(value = "{ '_id': ?0 }", fields = "{ 'settings': 1 }")
    Store findStoreSettings(String storeId);
    
    // Search with relationships
    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } } " +
           "], " +
           "'categories': { $in: ?1 }, " +
           "'tags': { $in: ?2 } }")
    Page<Store> findBySearchCriteria(String query, List<String> categories, List<String> tags, Pageable pageable);
} 