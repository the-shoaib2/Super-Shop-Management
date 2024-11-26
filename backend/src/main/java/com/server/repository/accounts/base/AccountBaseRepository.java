package com.server.repository.accounts.base;

import org.springframework.data.repository.NoRepositoryBean;
import com.server.repository.base.BaseRepository;
import java.util.Optional;

@NoRepositoryBean
public interface AccountBaseRepository<T, ID> extends BaseRepository<T, ID> {
    Optional<T> findByEmail(String email);
    boolean existsByEmail(String email);
} 