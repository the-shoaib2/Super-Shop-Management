package com.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.repository.OrderRepository;
import com.server.repository.StoreRepository;

import java.util.HashMap;
import java.util.Map;


@Service
public class AnalyticsService {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private StoreRepository storeRepository;
    
    public Map<String, Object> getStoreAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("revenue", orderRepository.calculateTotalRevenue(storeId));
        analytics.put("topProducts", orderRepository.findTopSellingProducts(storeId));
        return analytics;
    }

    public Map<String, Object> getStoreCustomersAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalCustomers", storeRepository.findCustomerCountByStoreId(storeId));
        return analytics;
    }

    public Map<String, Object> getStoreProductsAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalProducts", storeRepository.findProductCountByStoreId(storeId));
        return analytics;
    }

    public Map<String, Object> getStoreInventoryAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("value", storeRepository.calculateInventoryValueByStoreId(storeId));
        return analytics;
    }

    public Map<String, Object> getStoreReviewsAnalytics(String storeId) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("averageRating", storeRepository.calculateAverageRatingByStoreId(storeId));
        analytics.put("totalReviews", storeRepository.findReviewCountByStoreId(storeId));
        return analytics;
    }
} 