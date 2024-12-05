package com.server.repository.order;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;

import com.server.model.order.Order;

import java.util.List;
import java.util.Map;
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

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0 } }",
        "{ $group: { _id: '$product', stockLevel: { $sum: '$quantity' } } }",
        "{ $sort: { stockLevel: 1 } }"
    })
    List<Map<String, Object>> getProductStockLevels(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0, quantity: { $lt: 10 } } }",
        "{ $group: { _id: '$product', stockLevel: { $sum: '$quantity' } } }"
    })
    List<Map<String, Object>> getLowStockProducts(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0 } }",
        "{ $group: { _id: '$category', totalValue: { $sum: { $multiply: ['$quantity', '$price'] } } } }"
    })
    Map<String, BigDecimal> getStockValueByCategory(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0, createdAt: { $gte: ?1, $lte: ?2 } } }",
        "{ $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, totalSales: { $sum: '$totalAmount' } } }",
        "{ $sort: { '_id': 1 } }"
    })
    List<Map<String, Object>> getDailySalesTrend(String storeId, LocalDateTime start, LocalDateTime end);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0, createdAt: { $gte: ?1, $lte: ?2 } } }",
        "{ $group: { _id: '$category', totalSales: { $sum: '$totalAmount' } } }"
    })
    Map<String, BigDecimal> getSalesByCategory(String storeId, LocalDateTime start, LocalDateTime end);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0, createdAt: { $gte: ?1, $lte: ?2 } } }",
        "{ $group: { _id: '$product', totalSales: { $sum: '$totalAmount' }, quantity: { $sum: '$quantity' } } }",
        "{ $sort: { totalSales: -1 } }",
        "{ $limit: 10 }"
    })
    List<Map<String, Object>> getTopSellingProducts(String storeId, LocalDateTime start, LocalDateTime end);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0 } }",
        "{ $group: { _id: '$category', totalSales: { $sum: '$totalAmount' } } }",
        "{ $project: { _id: 1, percentage: { $multiply: [{ $divide: ['$totalSales', { $sum: '$totalSales' }] }, 100] } } }"
    })
    Map<String, BigDecimal> getCategorySalesDistribution(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0 } }",
        "{ $group: { _id: '$category', currentSales: { $sum: { $cond: [ { $gte: ['$createdAt', { $subtract: [new Date(), 30*24*60*60*1000] }] }, '$totalAmount', 0 ] } }, previousSales: { $sum: { $cond: [ { $lt: ['$createdAt', { $subtract: [new Date(), 30*24*60*60*1000] }] }, '$totalAmount', 0 ] } } } }",
        "{ $project: { growthRate: { $multiply: [{ $divide: [{ $subtract: ['$currentSales', '$previousSales'] }, '$previousSales'] }, 100] } } }"
    })
    Map<String, BigDecimal> getCategoryGrowthRates(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0 } }",
        "{ $group: { _id: '$category', totalSales: { $sum: '$totalAmount' }, totalOrders: { $sum: 1 } } }",
        "{ $sort: { totalSales: -1 } }",
        "{ $limit: 5 }"
    })
    List<Map<String, Object>> getTopPerformingCategories(String storeId);

    @Aggregation(pipeline = {
        "{ $match: { storeId: ?0, createdAt: { $gte: ?1, $lte: ?2 } } }",
        "{ $group: { _id: null, currentSales: { $sum: '$totalAmount' } } }",
        "{ $project: { growthRate: { $multiply: [{ $divide: ['$currentSales', { $ifNull: ['$previousSales', 1] }] }, 100] } } }"
    })
    BigDecimal calculateSalesGrowthRate(String storeId, LocalDateTime start, LocalDateTime end);
}