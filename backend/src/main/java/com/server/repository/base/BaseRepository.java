package com.server.repository.base;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.NoRepositoryBean;
import java.util.Optional;
import java.util.List;
import org.springframework.lang.NonNull;

@NoRepositoryBean
public interface BaseRepository<T, ID> extends MongoRepository<T, ID> {
    @NonNull
    Optional<T> findById(@NonNull ID id);
    @NonNull
    List<T> findAll();
    void deleteById(@NonNull ID id);
    @NonNull <S extends T> S save(@NonNull S entity);
    boolean existsById(@NonNull ID id);
} 