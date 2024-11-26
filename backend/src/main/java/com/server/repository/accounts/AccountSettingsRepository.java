package com.server.repository.accounts;

import org.springframework.stereotype.Repository;
import com.server.model.accounts.AccountSettings;
import com.server.repository.accounts.base.AccountBaseRepository;
import java.util.Optional;

@Repository
public interface AccountSettingsRepository extends AccountBaseRepository<AccountSettings, String> {
    Optional<AccountSettings> findByUserId(String userId);
} 