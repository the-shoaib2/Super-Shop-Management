package com.server.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.server.model.store.StoreOwner;

@Repository
public interface StoreOwnerRepository extends MongoRepository<StoreOwner, String> {
    Optional<StoreOwner> findByEmail(String email);
    Optional<StoreOwner> findByOwnerId(String ownerId);
    boolean existsByEmail(String email);
}   