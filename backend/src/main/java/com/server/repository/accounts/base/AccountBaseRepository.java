package com.server.repository.accounts.base;

import org.springframework.data.repository.NoRepositoryBean;
import com.server.repository.base.BaseRepository;

@NoRepositoryBean
public interface AccountBaseRepository<T, ID> extends BaseRepository<T, ID> {
    // Remove email-related methods since not all account entities have email
} 