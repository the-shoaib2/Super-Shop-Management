package com.server.repository.accounts;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.server.model.accounts.Owner;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<Owner, String> {
    Optional<Owner> findByEmail(String email);
    Optional<Owner> findByEmailOrId(String email, String id);
    boolean existsByEmail(String email);
} 