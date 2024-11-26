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
    
    @Query("{ '_id': ?0, 'ownerId': ?1 }")
    Optional<Store> findByIdAndOwnerId(String id, String ownerId);
    
    // Active store queries
    @Query("{ 'ownerEmail': ?0, 'isActive': true }")
    List<Store> findActiveStoresByOwnerEmail(String email);
    
    @Query("{ 'ownerId': ?0, 'isActive': true }")
    List<Store> findActiveStoresByOwnerId(String ownerId);
    
    // Search queries
    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } } " +
           "], " +
           "'categories': { $in: ?1 }, " +
           "'tags': { $in: ?2 } }")
    Page<Store> findBySearchCriteria(String query, List<String> categories, List<String> tags, Pageable pageable);
    
    // Category queries
    @Query(value = "{ 'categories': { $exists: true } }", fields = "{ 'categories': 1 }")
    List<Store> findAllWithCategories();
    
    // Ordered queries
    @Query(value = "{ 'ownerEmail': ?0 }", sort = "{ 'createdAt': -1 }")
    List<Store> findByOwnerEmailOrderByCreatedAtDesc(String email);
    
    // DBRef queries
    @Query(value = "{ '_id': { $in: ?0 } }")
    List<Store> findByIds(List<String> storeIds);
} 