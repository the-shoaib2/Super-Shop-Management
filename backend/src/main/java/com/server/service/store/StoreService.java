package com.server.service.store;

import org.springframework.stereotype.Service;
import com.server.dto.StoreDTO;
import com.server.entity.Store;
import com.server.exception.ResourceNotFoundException;
import com.server.repository.StoreRepository;
import com.server.model.store.StoreOwner;
import com.server.repository.StoreOwnerRepository;
import com.server.exception.StoreOperationException;
import com.server.exception.UnauthorizedException;
import com.server.util.IdGenerator;
import com.server.dto.StoreWithOwnerDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class StoreService {
    private static final Logger logger = LoggerFactory.getLogger(StoreService.class);

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private StoreOwnerRepository storeOwnerRepository;

    public Page<Store> getAllStores(Pageable pageable) {
        return storeRepository.findAll(pageable);
    }

    @Transactional
    public Store createStore(StoreDTO storeDTO) {
        try {
            // Validate owner exists
            StoreOwner owner = storeOwnerRepository.findByEmail(storeDTO.getOwnerEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Store owner not found"));

            Store store = new Store();
            store.setStoreId(IdGenerator.generateStoreId());
            store.setName(storeDTO.getName());
            store.setDescription(storeDTO.getDescription());
            store.setAddress(storeDTO.getAddress());
            store.setLocation(storeDTO.getLocation());
            store.setCategories(storeDTO.getCategories());
            store.setTags(storeDTO.getTags());
            store.setOwnerEmail(owner.getEmail());
            store.setActive(true);
            store.setCreatedAt(LocalDateTime.now());
            store.setUpdatedAt(LocalDateTime.now());

            Store savedStore = storeRepository.save(store);

            // Convert entity.Store to model.Store for StoreOwner
            com.server.model.store.Store modelStore = convertToModelStore(savedStore);
            
            // Update owner's stores list
            List<com.server.model.store.Store> ownerStores = owner.getStores();
            if (ownerStores == null) {
                ownerStores = new ArrayList<>();
            }
            ownerStores.add(modelStore);
            owner.setStores(ownerStores);
            storeOwnerRepository.save(owner);

            return savedStore;

        } catch (Exception e) {
            logger.error("Error creating store: ", e);
            throw new StoreOperationException("Failed to create store: " + e.getMessage());
        }
    }

    // Helper method to convert entity.Store to model.Store
    private com.server.model.store.Store convertToModelStore(Store entityStore) {
        com.server.model.store.Store modelStore = new com.server.model.store.Store();
        modelStore.setId(entityStore.getId());
        modelStore.setStoreId(entityStore.getStoreId());
        modelStore.setName(entityStore.getName());
        modelStore.setDescription(entityStore.getDescription());
        modelStore.setAddress(entityStore.getAddress());
        modelStore.setLocation(entityStore.getLocation());
        modelStore.setCategories(entityStore.getCategories());
        modelStore.setTags(entityStore.getTags());
        modelStore.setOwnerEmail(entityStore.getOwnerEmail());
        modelStore.setActive(entityStore.isActive());
        modelStore.setCreatedAt(entityStore.getCreatedAt());
        modelStore.setUpdatedAt(entityStore.getUpdatedAt());
        return modelStore;
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
        store.setCategories(storeDTO.getCategories());
        store.setTags(storeDTO.getTags());
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

    public List<Store> getStoresByOwner(String ownerEmail) {
        return storeRepository.findAllByOwnerEmail(ownerEmail);
    }

    public Store getCurrentStoreByOwner(String ownerEmail) {
        try {
            List<Store> stores = storeRepository.findByOwnerEmailOrderByCreatedAtDesc(ownerEmail);
            
            if (!stores.isEmpty()) {
                return stores.get(0);
            }
            
            throw new ResourceNotFoundException("No stores found for owner: " + ownerEmail);
            
        } catch (Exception e) {
            logger.error("Error getting current store for owner {}: {}", ownerEmail, e.getMessage());
            throw new RuntimeException("Failed to retrieve current store: " + e.getMessage());
        }
    }

    public Store switchStore(String storeId, String userEmail) {
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
        
        if (!store.getOwnerEmail().equals(userEmail)) {
            throw new UnauthorizedException("You don't have access to this store");
        }
        
        return store;
    }

    public StoreWithOwnerDTO getStoreWithOwner(String storeId) {
        Store store = getStoreById(storeId);
        StoreOwner owner = storeOwnerRepository.findByEmail(store.getOwnerEmail())
            .orElseThrow(() -> new ResourceNotFoundException("Store owner not found"));

        return StoreWithOwnerDTO.builder()
            .store(store)
            .ownerName(owner.getFullName())
            .ownerEmail(owner.getEmail())
            .build();
    }
} 