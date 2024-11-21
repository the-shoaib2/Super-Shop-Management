package com.server.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.server.repository.OrderRepository;
import com.server.repository.StoreRepository;

import java.util.Map;
import java.util.HashMap;

@Service
public class AdminService {
    @Autowired
    private StoreRepository storeRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    public Map<String, Object> getDashboardStats() {
        try {
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalStores", storeRepository.count());
            stats.put("totalOrders", orderRepository.count());
            // Add more dashboard statistics
            return stats;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve dashboard stats", e);
        }
    }

    public Map<String, Object> getStoresOverview() {
        try {
            Map<String, Object> overview = new HashMap<>();
            overview.put("activeStores", storeRepository.count());
            
            return overview;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve stores overview", e);
        }
    }

    public Map<String, Object> getSystemAnalytics() {
        try {
            Map<String, Object> analytics = new HashMap<>();
            // Add system-wide analytics
            return analytics;
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve system analytics", e);
        }
    }
} 