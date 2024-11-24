package com.server.service.analytics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.model.order.Order;
import com.server.repository.OrderRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.stream.Collectors;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AnalyticsService {
    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);
    
    @Autowired
    private OrderRepository orderRepository;
    
    public Map<String, Object> getStoreAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        try {
            // Add default values for stats
            analytics.put("totalSales", BigDecimal.ZERO);
            analytics.put("totalOrders", 0);
            analytics.put("totalProducts", 0);
            analytics.put("totalCustomers", 0);
            analytics.put("revenue", BigDecimal.ZERO);
            analytics.put("topProducts", Collections.emptyList());
            
            // Try to get actual values if available
            try {
                BigDecimal revenue = orderRepository.calculateTotalRevenue(storeId);
                if (revenue != null) {
                    analytics.put("revenue", revenue);
                }
            } catch (Exception e) {
                logger.error("Error calculating revenue for store {}: {}", storeId, e.getMessage());
            }
            
            try {
                List<Order> topOrders = orderRepository.findTopSellingProducts(storeId);
                if (topOrders != null && !topOrders.isEmpty()) {
                    List<Map<String, Object>> topOrdersData = topOrders.stream()
                        .map(order -> {
                            Map<String, Object> orderData = new HashMap<>();
                            orderData.put("id", order.getId());
                            orderData.put("totalAmount", order.getTotalAmount());
                            orderData.put("status", order.getStatus());
                            orderData.put("createdAt", order.getCreatedAt());
                            return orderData;
                        })
                        .collect(Collectors.toList());
                    analytics.put("topOrders", topOrdersData);
                }
            } catch (Exception e) {
                logger.error("Error fetching top orders for store {}: {}", storeId, e.getMessage());
            }

            // Get customer analytics
            try {
                Map<String, Object> customerStats = getStoreCustomersAnalytics(storeId);
                analytics.put("customers", customerStats);
            } catch (Exception e) {
                logger.error("Error fetching customer analytics for store {}: {}", storeId, e.getMessage());
            }

            // Get product analytics
            try {
                Map<String, Object> productStats = getStoreProductsAnalytics(storeId);
                analytics.put("products", productStats);
            } catch (Exception e) {
                logger.error("Error fetching product analytics for store {}: {}", storeId, e.getMessage());
            }

            // Get inventory analytics
            try {
                Map<String, Object> inventoryStats = getStoreInventoryAnalytics(storeId);
                analytics.put("inventory", inventoryStats);
            } catch (Exception e) {
                logger.error("Error fetching inventory analytics for store {}: {}", storeId, e.getMessage());
            }

            // Get review analytics
            try {
                Map<String, Object> reviewStats = getStoreReviewsAnalytics(storeId);
                analytics.put("reviews", reviewStats);
            } catch (Exception e) {
                logger.error("Error fetching review analytics for store {}: {}", storeId, e.getMessage());
            }
            
        } catch (Exception e) {
            logger.error("Error getting store analytics for store {}: {}", storeId, e.getMessage());
        }
        return analytics;
    }

    public Map<String, Object> getStoreCustomersAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        try {
            analytics.put("totalCustomers", 0);
            analytics.put("newCustomers", 0);
            analytics.put("returningCustomers", 0);
            analytics.put("averageOrderValue", BigDecimal.ZERO);
            analytics.put("customerRetentionRate", 0.0);
            
            // Add actual implementation here when customer repository is available
            
        } catch (Exception e) {
            logger.error("Error getting customer analytics for store {}: {}", storeId, e.getMessage());
        }
        return analytics;
    }

    public Map<String, Object> getStoreProductsAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        try {
            analytics.put("totalProducts", 0);
            analytics.put("activeProducts", 0);
            analytics.put("outOfStock", 0);
            analytics.put("lowStock", 0);
            analytics.put("topSelling", Collections.emptyList());
            analytics.put("averageRating", 0.0);
            
            // Add actual implementation here when product repository is available
            
        } catch (Exception e) {
            logger.error("Error getting product analytics for store {}: {}", storeId, e.getMessage());
        }
        return analytics;
    }

    public Map<String, Object> getStoreInventoryAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        try {
            analytics.put("totalValue", BigDecimal.ZERO);
            analytics.put("totalItems", 0);
            analytics.put("lowStockItems", Collections.emptyList());
            analytics.put("outOfStockItems", Collections.emptyList());
            analytics.put("inventoryTurnoverRate", 0.0);
            
            // Add actual implementation here when inventory repository is available
            
        } catch (Exception e) {
            logger.error("Error getting inventory analytics for store {}: {}", storeId, e.getMessage());
        }
        return analytics;
    }

    public Map<String, Object> getStoreReviewsAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        try {
            analytics.put("averageRating", 0.0);
            analytics.put("totalReviews", 0);
            analytics.put("recentReviews", Collections.emptyList());
            analytics.put("ratingDistribution", Collections.emptyMap());
            analytics.put("sentimentAnalysis", Collections.emptyMap());
            
            // Add actual implementation here when review repository is available
            
        } catch (Exception e) {
            logger.error("Error getting review analytics for store {}: {}", storeId, e.getMessage());
        }
        return analytics;
    }

    public Map<String, Object> getSalesReport(LocalDateTime start, LocalDateTime end) {
        Map<String, Object> report = new HashMap<>();
        try {
            // Get orders between dates
            List<Order> orders = orderRepository.findByCreatedAtBetween(start, end);
            
            // Process orders for sales data
            List<Map<String, Object>> salesData = new ArrayList<>();
            Map<String, Integer> orderStatusCount = new HashMap<>();
            
            for (Order order : orders) {
                // Add to sales data
                Map<String, Object> salePoint = new HashMap<>();
                salePoint.put("date", order.getCreatedAt());
                salePoint.put("amount", order.getTotalAmount());
                salesData.add(salePoint);
                
                // Count order statuses
                orderStatusCount.merge(order.getStatus(), 1, Integer::sum);
            }
            
            // Add data to report
            report.put("salesData", salesData);
            report.put("pendingOrders", orderStatusCount.getOrDefault("pending", 0));
            report.put("processingOrders", orderStatusCount.getOrDefault("processing", 0));
            report.put("completedOrders", orderStatusCount.getOrDefault("completed", 0));
            report.put("cancelledOrders", orderStatusCount.getOrDefault("cancelled", 0));
            
        } catch (Exception e) {
            logger.error("Error generating sales report: {}", e.getMessage());
            throw new RuntimeException("Failed to generate sales report", e);
        }
        return report;
    }
} 