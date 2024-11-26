package com.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.server.model.store.Billboard;
import java.util.List;

@Repository
public interface BillboardRepository extends MongoRepository<Billboard, String> {
    List<Billboard> findByStoreId(String storeId);
} 