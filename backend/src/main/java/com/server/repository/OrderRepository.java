package com.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;
import com.server.model.Order;
import java.util.List;
import java.math.BigDecimal;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);
    List<Order> findByStoreId(String storeId);
    List<Order> findByStatus(String status);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0 } }",
        "{ $group: { _id: null, total: { $sum: '$totalAmount' } } }"
    })
    BigDecimal calculateTotalRevenue(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0 } }",
        "{ $sort: { totalAmount: -1 } }",
        "{ $limit: 10 }"
    })
    List<Order> findTopSellingProducts(String storeId);
}