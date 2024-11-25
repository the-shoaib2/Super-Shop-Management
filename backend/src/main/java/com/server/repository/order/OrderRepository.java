package com.server.repository.order;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import com.server.model.order.Order;

import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}