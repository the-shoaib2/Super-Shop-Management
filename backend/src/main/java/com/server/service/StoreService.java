package com.server.service;

import org.springframework.stereotype.Service;
import com.server.dto.StoreDTO;
import com.server.entity.Store;
import com.server.exception.ResourceNotFoundException;
import com.server.repository.StoreRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.stream.Collectors;

@Service
public class StoreService {
    private static final Logger logger = LoggerFactory.getLogger(StoreService.class);

    @Autowired
    private StoreRepository storeRepository;

    public Page<Store> getAllStores(Pageable pageable) {
        return storeRepository.findAll(pageable);
    }

    public Store createStore(StoreDTO storeDTO) {
        try {
            Store store = new Store();
            store.setName(storeDTO.getName());
            store.setType(storeDTO.getType());
            store.setDescription(storeDTO.getDescription());
            store.setAddress(storeDTO.getAddress());
            store.setLocation(storeDTO.getLocation());
            store.setPhone(storeDTO.getPhone());
            store.setEmail(storeDTO.getEmail());
            store.setCategories(storeDTO.getCategories());
            store.setTags(storeDTO.getTags());
            store.setImages(new ArrayList<>()); // Initialize empty images list
            store.setOwnerId(storeDTO.getOwnerId());
            store.setOwnerEmail(storeDTO.getOwnerEmail());
            store.setActive(true);
            store.setCreatedAt(LocalDateTime.now());
            store.setUpdatedAt(LocalDateTime.now());
            
            return storeRepository.save(store);
        } catch (Exception e) {
            logger.error("Error creating store: ", e);
            throw new RuntimeException("Failed to create store: " + e.getMessage());
        }
    }

    public Store getStoreById(String storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
    }

    public Store updateStore(String storeId, StoreDTO storeDTO) {
        Store store = getStoreById(storeId);
        
        store.setName(storeDTO.getName());
        store.setType(storeDTO.getType());
        store.setDescription(storeDTO.getDescription());
        store.setAddress(storeDTO.getAddress());
        store.setLocation(storeDTO.getLocation());
        store.setPhone(storeDTO.getPhone());
        store.setEmail(storeDTO.getEmail());
        store.setCategories(storeDTO.getCategories());
        store.setTags(storeDTO.getTags());
        store.setImages(storeDTO.getImages());
        store.setUpdatedAt(LocalDateTime.now());
        
        return storeRepository.save(store);
    }

    public void deleteStore(String storeId) {
        Store store = getStoreById(storeId);
        store.setActive(false);
        store.setUpdatedAt(LocalDateTime.now());
        storeRepository.save(store);
    }

    public Page<Store> searchStores(String query, List<String> categories, List<String> tags, Pageable pageable) {
        return storeRepository.findBySearchCriteria(
            query != null ? query : "",
            categories != null ? categories : Collections.emptyList(),
            tags != null ? tags : Collections.emptyList(),
            pageable
        );
    }

    public List<String> getAllCategories() {
        return storeRepository.findAllWithCategories().stream()
                .map(Store::getCategories)
                .filter(Objects::nonNull)
                .flatMap(List::stream)
                .distinct()
                .collect(Collectors.toList());
    }

    public String findOwnerIdByEmail(String email) {
        return storeRepository.findByOwnerEmailOrderByCreatedAtDesc(email)
                .stream()
                .findFirst()
                .map(Store::getOwnerId)
                .orElse(null);
    }

    public Map<String, Object> getStoreStats(String storeId) {
        Store store = getStoreById(storeId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", 0);
        stats.put("totalOrders", 0);
        stats.put("totalRevenue", 0.0);
        stats.put("totalCustomers", 0);
        return stats;
    }

    public Map<String, Object> getStoreAnalytics(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("sales", getStoreSalesAnalytics(storeId));
        analytics.put("customers", getStoreCustomersAnalytics(storeId));
        analytics.put("products", getStoreProductsAnalytics(storeId));
        analytics.put("inventory", getStoreInventoryAnalytics(storeId));
        analytics.put("reviews", getStoreReviewsAnalytics(storeId));
        return analytics;
    }

    public Map<String, Object> getStoreSalesAnalytics(String storeId) {
        Map<String, Object> salesAnalytics = new HashMap<>();
        salesAnalytics.put("totalRevenue", 0.0);
        salesAnalytics.put("monthlySales", Collections.emptyList());
        salesAnalytics.put("topProducts", Collections.emptyList());
        return salesAnalytics;
    }

    public Map<String, Object> getStoreCustomersAnalytics(String storeId) {
        Map<String, Object> customerAnalytics = new HashMap<>();
        customerAnalytics.put("totalCustomers", 0);
        customerAnalytics.put("newCustomers", 0);
        customerAnalytics.put("returningCustomers", 0);
        return customerAnalytics;
    }

    public Map<String, Object> getStoreProductsAnalytics(String storeId) {
        Map<String, Object> productAnalytics = new HashMap<>();
        productAnalytics.put("totalProducts", 0);
        productAnalytics.put("activeProducts", 0);
        productAnalytics.put("outOfStock", 0);
        productAnalytics.put("lowStock", 0);
        return productAnalytics;
    }

    public Map<String, Object> getStoreInventoryAnalytics(String storeId) {
        Map<String, Object> inventoryAnalytics = new HashMap<>();
        inventoryAnalytics.put("totalValue", 0.0);
        inventoryAnalytics.put("totalItems", 0);
        inventoryAnalytics.put("lowStockItems", Collections.emptyList());
        return inventoryAnalytics;
    }

    public Map<String, Object> getStoreReviewsAnalytics(String storeId) {
        Map<String, Object> reviewAnalytics = new HashMap<>();
        reviewAnalytics.put("averageRating", 0.0);
        reviewAnalytics.put("totalReviews", 0);
        reviewAnalytics.put("recentReviews", Collections.emptyList());
        return reviewAnalytics;
    }

    public String findEmailById(String ownerId) {
        return storeRepository.findById(ownerId)
                .map(Store::getOwnerEmail)
                .orElse(null);
    }

    public List<Store> getStoresByOwner(String ownerEmail) {
        return storeRepository.findAllByOwnerEmail(ownerEmail);
    }

    public Store getCurrentStoreByOwner(String ownerEmail) {
        try {
            List<Store> stores = storeRepository.findByOwnerEmailOrderByCreatedAtDesc(ownerEmail);
            
            if (!stores.isEmpty()) {
                return stores.get(0);
            }
            
            // If no stores at all, throw exception
            throw new ResourceNotFoundException("No stores found for owner: " + ownerEmail);
            
        } catch (Exception e) {
            logger.error("Error getting current store for owner {}: {}", ownerEmail, e.getMessage());
            throw new RuntimeException("Failed to retrieve current store: " + e.getMessage());
        }
    }
} 