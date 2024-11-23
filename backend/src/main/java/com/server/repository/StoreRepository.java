package com.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.server.entity.Store;
import java.util.List;
import java.util.Optional;

public interface StoreRepository extends MongoRepository<Store, String> {
    
    @Query("{ '_id': ?0 }")
    Store findByStoreId(String storeId);

    @Query("{ 'ownerEmail': ?0 }")
    List<Store> findAllByOwnerEmail(String email);

    @Query("{ 'ownerId': ?0 }")
    List<Store> findByOwnerId(String ownerId);

    @Query("{ $or: [ " +
           "{ 'name': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } } " +
           "], " +
           "'categories': { $in: ?1 }, " +
           "'tags': { $in: ?2 } }")
    Page<Store> findBySearchCriteria(String query, List<String> categories, List<String> tags, Pageable pageable);

    @Query(value = "{ 'categories': { $exists: true } }", fields = "{ 'categories': 1 }")
    List<Store> findAllWithCategories();

    @Query(value = "{ 'ownerEmail': ?0 }", sort = "{ 'createdAt': -1 }")
    List<Store> findByOwnerEmailOrderByCreatedAtDesc(String email);
} 