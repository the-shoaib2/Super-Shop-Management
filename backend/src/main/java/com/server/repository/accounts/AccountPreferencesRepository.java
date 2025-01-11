package com.server.repository.accounts;

import com.server.model.accounts.AccountPreferences;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AccountPreferencesRepository extends MongoRepository<AccountPreferences, String> {
    Optional<AccountPreferences> findByUserId(String userId);
} 