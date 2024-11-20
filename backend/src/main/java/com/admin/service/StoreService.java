package com.admin.service;

import org.springframework.stereotype.Service;
import com.admin.entity.Store;
import com.admin.dto.StoreDTO;
import com.admin.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.admin.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.math.BigDecimal;
import com.admin.entity.Product;
import com.admin.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StoreService {
    private static final Logger logger = LoggerFactory.getLogger(StoreService.class);

    @Autowired
    private StoreRepository storeRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    public Page<Store> getAllStores(Pageable pageable) {
        try {
            return storeRepository.findAll(pageable);
        } catch (Exception e) {
            logger.error("Error fetching all stores: ", e);
            throw new RuntimeException("Failed to fetch stores");
        }
    }
    
    public Store createStore(StoreDTO storeDTO) {
        try {
            Store store = new Store();
            store.setName(storeDTO.getName());
            return storeRepository.save(store);
        } catch (Exception e) {
            logger.error("Error creating store: ", e);
            throw new RuntimeException("Failed to create store");
        }
    }
    
    public Map<String, Object> getStoreStats(String storeId) {
        try {
            validateStore(storeId);
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalSales", storeRepository.findTotalSalesByStoreId(storeId));
            stats.put("customerCount", storeRepository.findCustomerCountByStoreId(storeId));
            stats.put("productCount", storeRepository.findProductCountByStoreId(storeId));
            stats.put("inventoryValue", storeRepository.calculateInventoryValueByStoreId(storeId));
            stats.put("reviewCount", storeRepository.findReviewCountByStoreId(storeId));
            stats.put("averageRating", storeRepository.calculateAverageRatingByStoreId(storeId));
            stats.put("recentOrders", storeRepository.findRecentOrdersCountByStoreId(storeId));
            stats.put("topSellingProducts", orderRepository.findTopSellingProducts(storeId));
            stats.put("recentReviews", storeRepository.findRecentReviewsByStoreId(storeId));
            return stats;
        } catch (Exception e) {
            logger.error("Error fetching store stats: ", e);
            throw new RuntimeException("Failed to fetch store statistics");
        }
    }

    public Map<String, Object> getStoreAnalytics(String storeId) {
        try {
            validateStore(storeId);
            Map<String, Object> analytics = new HashMap<>();
            analytics.put("sales", getStoreSalesAnalytics(storeId));
            analytics.put("customers", getStoreCustomersAnalytics(storeId));
            analytics.put("products", getStoreProductsAnalytics(storeId));
            analytics.put("inventory", getStoreInventoryAnalytics(storeId));
            analytics.put("reviews", getStoreReviewsAnalytics(storeId));
            return analytics;
        } catch (Exception e) {
            logger.error("Error fetching store analytics: ", e);
            throw new RuntimeException("Failed to fetch store analytics");
        }
    }

    public Map<String, Object> getStoreSalesAnalytics(String storeId) {
        try {
            validateStore(storeId);
            Map<String, Object> salesAnalytics = new HashMap<>();
            salesAnalytics.put("totalRevenue", orderRepository.calculateTotalRevenue(storeId));
            salesAnalytics.put("monthlySales", orderRepository.getMonthlySales(storeId));
            salesAnalytics.put("topProducts", orderRepository.findTopSellingProducts(storeId));
            return salesAnalytics;
        } catch (Exception e) {
            logger.error("Error fetching sales analytics: ", e);
            throw new RuntimeException("Failed to fetch sales analytics");
        }
    }

    public Map<String, Object> getStoreCustomersAnalytics(String storeId) {
        try {
            validateStore(storeId);
            Map<String, Object> customerAnalytics = new HashMap<>();
            customerAnalytics.put("totalCustomers", storeRepository.findCustomerCountByStoreId(storeId));
            // Add more customer analytics as needed
            return customerAnalytics;
        } catch (Exception e) {
            logger.error("Error fetching customer analytics: ", e);
            throw new RuntimeException("Failed to fetch customer analytics");
        }
    }

    public Map<String, Object> getStoreProductsAnalytics(String storeId) {
        try {
            validateStore(storeId);
            Map<String, Object> productAnalytics = new HashMap<>();
            productAnalytics.put("totalProducts", storeRepository.findProductCountByStoreId(storeId));
            productAnalytics.put("topSelling", orderRepository.findTopSellingProducts(storeId));
            return productAnalytics;
        } catch (Exception e) {
            logger.error("Error fetching product analytics: ", e);
            throw new RuntimeException("Failed to fetch product analytics");
        }
    }

    public Map<String, Object> getStoreInventoryAnalytics(String storeId) {
        try {
            validateStore(storeId);
            Map<String, Object> inventoryAnalytics = new HashMap<>();
            inventoryAnalytics.put("totalValue", storeRepository.calculateInventoryValueByStoreId(storeId));
            return inventoryAnalytics;
        } catch (Exception e) {
            logger.error("Error fetching inventory analytics: ", e);
            throw new RuntimeException("Failed to fetch inventory analytics");
        }
    }

    public Map<String, Object> getStoreReviewsAnalytics(String storeId) {
        try {
            validateStore(storeId);
            Map<String, Object> reviewAnalytics = new HashMap<>();
            reviewAnalytics.put("totalReviews", storeRepository.findReviewCountByStoreId(storeId));
            reviewAnalytics.put("averageRating", storeRepository.calculateAverageRatingByStoreId(storeId));
            reviewAnalytics.put("recentReviews", storeRepository.findRecentReviewsByStoreId(storeId));
            return reviewAnalytics;
        } catch (Exception e) {
            logger.error("Error fetching review analytics: ", e);
            throw new RuntimeException("Failed to fetch review analytics");
        }
    }

    private void validateStore(String storeId) {
        Store store = storeRepository.findByStoreId(storeId);
        if (store == null) {
            throw new ResourceNotFoundException("Store not found with id: " + storeId);
        }
    }
} 