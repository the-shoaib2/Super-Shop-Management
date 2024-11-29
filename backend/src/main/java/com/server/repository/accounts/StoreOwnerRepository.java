package com.server.repository.accounts;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.server.model.accounts.Owner;

@Repository
public interface StoreOwnerRepository extends MongoRepository<Owner, String> {
    Optional<Owner> findByEmail(String email);
    Optional<Owner> findByEmailOrId(String email, String id);
    Optional<Owner> findByOwnerId(String ownerId);
    boolean existsByEmail(String email);
}   