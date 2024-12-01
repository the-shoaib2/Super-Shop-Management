package com.server.repository.store.settings;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.server.model.store.Price;
import java.util.List;

@Repository
public interface PriceRepository extends MongoRepository<Price, String> {
    List<Price> findByStoreId(String storeId);
    
    @Query("{ 'storeId': ?0, 'isActive': true }")
    List<Price> findActiveByStoreId(String storeId);
    
    @Query("{ 'storeId': ?0, 'productIds': ?1 }")
    List<Price> findByStoreIdAndProductId(String storeId, String productId);
    
    @Query("{ 'storeId': ?0, 'isDiscounted': true }")
    List<Price> findDiscountedByStoreId(String storeId);
    
    @Query("{ 'storeId': ?0, 'type': ?1 }")
    List<Price> findByStoreIdAndType(String storeId, String type);
} 