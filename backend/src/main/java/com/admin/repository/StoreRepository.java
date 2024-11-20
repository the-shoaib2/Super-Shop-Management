package com.admin.repository;

import com.admin.entity.Store;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import java.util.List;
import java.math.BigDecimal;

public interface StoreRepository extends MongoRepository<Store, String> {
    @Query(value = "{ '_id': ?0 }")
    Store findByStoreId(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { '_id': ?0 } }",
        "{ $lookup: { from: 'orders', localField: '_id', foreignField: 'storeId', as: 'orders' } }",
        "{ $project: { totalSales: { $size: '$orders' } } }"
    })
    Integer findTotalSalesByStoreId(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { '_id': ?0 } }",
        "{ $lookup: { from: 'customers', localField: '_id', foreignField: 'storeId', as: 'customers' } }",
        "{ $project: { customerCount: { $size: '$customers' } } }"
    })
    Integer findCustomerCountByStoreId(String storeId);

    @Query(value = "{ '_id': ?0 }", count = true)
    Integer findProductCountByStoreId(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { '_id': ?0 } }",
        "{ $unwind: '$products' }",
        "{ $group: { _id: null, total: { $sum: { $multiply: ['$products.price', '$products.quantity'] } } } }"
    })
    BigDecimal calculateInventoryValueByStoreId(String storeId);

    @Query(value = "{ '_id': ?0 }", count = true)
    Integer findReviewCountByStoreId(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { '_id': ?0 } }",
        "{ $lookup: { from: 'reviews', localField: '_id', foreignField: 'storeId', as: 'reviews' } }",
        "{ $unwind: '$reviews' }",
        "{ $group: { _id: null, avgRating: { $avg: '$reviews.rating' } } }"
    })
    Double calculateAverageRatingByStoreId(String storeId);

    @Query(value = "{ 'storeId': ?0, 'createdAt': { $gte: ?1 } }", count = true)
    Integer findRecentOrdersCountByStoreId(String storeId);

    @Query(value = "{ 'storeId': ?0 }", fields = "{ 'content': 1, 'createdAt': 1 }")
    List<String> findRecentReviewsByStoreId(String storeId);
} 