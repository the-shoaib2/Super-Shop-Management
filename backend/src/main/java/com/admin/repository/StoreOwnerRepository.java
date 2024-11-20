package com.admin.repository;

import com.admin.model.StoreOwner;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StoreOwnerRepository extends MongoRepository<StoreOwner, String> {
    Optional<StoreOwner> findByEmail(String email);
}   