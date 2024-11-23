package com.server.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.Aggregation;

import com.server.model.OrderProduct;

@Repository
public interface OrderRepository extends MongoRepository<OrderProduct, String> {
    List<OrderProduct> findByCustomerId(String customerId);

    List<OrderProduct> findByStatus(String status);

    @Query(value = "{ 'store.id': ?0 }", fields = "{ 'totalAmount': 1 }")
    List<OrderProduct> findOrdersByStoreId(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { 'storeId': ?0 } }",
        "{ $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }"
    })
    BigDecimal calculateTotalRevenue(String storeId);

    @Query(value = "{ 'storeId': ?0 }", fields = "{ 'date': 1, 'totalAmount': 1 }")
    List<OrderProduct> getMonthlySales(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { 'storeId': ?0 } }",
        "{ $group: { _id: '$product', totalQuantity: { $sum: '$quantity' } } }",
        "{ $sort: { totalQuantity: -1 } }",
        "{ $limit: 10 }"
    })
    List<OrderProduct> findTopSellingProducts(String storeId);
}