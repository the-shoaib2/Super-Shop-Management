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
        store.setImages(storeDTO.getImages());
        store.setOwnerId(storeDTO.getOwnerId());
        store.setOwnerEmail(storeDTO.getOwnerEmail());
        store.setActive(true);
        store.setCreatedAt(LocalDateTime.now());
        store.setUpdatedAt(LocalDateTime.now());
        
        return storeRepository.save(store);
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
        return storeRepository.findByOwnerEmail(email)
                .map(Store::getOwnerId)
                .orElse(null);
    }

    public Map<String, Object> getStoreStats(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> stats = new HashMap<>();
        // Add your stats logic here
        return stats;
    }

    public Map<String, Object> getStoreAnalytics(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> analytics = new HashMap<>();
        // Add your analytics logic here
        return analytics;
    }

    public Map<String, Object> getStoreSalesAnalytics(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> salesAnalytics = new HashMap<>();
        // Add your sales analytics logic here
        return salesAnalytics;
    }

    public Map<String, Object> getStoreCustomersAnalytics(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> customerAnalytics = new HashMap<>();
        // Add your customer analytics logic here
        return customerAnalytics;
    }

    public Map<String, Object> getStoreProductsAnalytics(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> productAnalytics = new HashMap<>();
        // Add your product analytics logic here
        return productAnalytics;
    }

    public Map<String, Object> getStoreInventoryAnalytics(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> inventoryAnalytics = new HashMap<>();
        // Add your inventory analytics logic here
        return inventoryAnalytics;
    }

    public Map<String, Object> getStoreReviewsAnalytics(String storeId) {
        Store store = getStoreById(storeId);
        Map<String, Object> reviewAnalytics = new HashMap<>();
        // Add your review analytics logic here
        return reviewAnalytics;
    }

    public String findEmailById(String ownerId) {
        return storeRepository.findById(ownerId)
                .map(Store::getOwnerEmail)
                .orElse(null);
    }
} 