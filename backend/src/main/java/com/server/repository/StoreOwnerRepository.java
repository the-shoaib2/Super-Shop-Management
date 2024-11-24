package com.server.repository;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.server.model.store.StoreOwner;

public interface StoreOwnerRepository extends MongoRepository<StoreOwner, String> {
    Optional<StoreOwner> findByEmail(String email);
}   