package com.server.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.server.model.Order;
import com.server.model.Product;

import org.springframework.data.mongodb.repository.Aggregation;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);

    List<Order> findByStatus(String status);

    @Query(value = "{ 'store.id': ?0 }", fields = "{ 'totalAmount': 1 }")
    List<Order> findOrdersByStoreId(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { 'store.id': ?0 } }",
        "{ $group: { _id: null, total: { $sum: '$totalAmount' } } }"
    })
    BigDecimal calculateTotalRevenue(String storeId);

    @Query(value = "{ 'storeId': ?0 }", fields = "{ 'date': 1, 'totalAmount': 1 }")
    List<Order> getMonthlySales(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { 'store.id': ?0 } }",
        "{ $unwind: '$items' }",
        "{ $group: { _id: '$items.product', totalSold: { $sum: '$items.quantity' } } }",
        "{ $sort: { totalSold: -1 } }",
        "{ $limit: 10 }"
    })
    List<Product> findTopSellingProducts(String storeId);
}