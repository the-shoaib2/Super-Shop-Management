package com.server.service.store;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.server.model.accounts.Owner;
import com.server.model.store.Store;
import com.server.repository.accounts.StoreOwnerRepository;
import com.server.repository.store.StoreRepository;
import com.server.dto.store.StoreDTO;
import com.server.exception.common.ResourceNotFoundException;
import com.server.util.IdGenerator;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class StoreService {
    private static final Logger logger = LoggerFactory.getLogger(StoreService.class);
    
    private final StoreRepository storeRepository;
    private final StoreOwnerRepository storeOwnerRepository;
    private final MongoTemplate mongoTemplate;

    public List<Store> getStoresByOwnerEmail(String email) {
        try {
            logger.info("Finding owner by email: {}", email);
            
            Owner owner = storeOwnerRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("Store owner not found for email: {}", email);
                    return new ResourceNotFoundException("Store owner not found");
                });
            
            // Get stores from owner
            List<Store> stores = owner.getStores();
            if (stores == null) {
                logger.info("No stores list found for owner: {}, creating new list", email);
                return new ArrayList<>();
            }

            // Resolve DBRefs manually if needed
            List<Store> resolvedStores = stores.stream()
                .map(store -> {
                    try {
                        if (store.getId() != null) {
                            return mongoTemplate.findById(store.getId(), Store.class);
                        }
                        return null;
                    } catch (Exception e) {
                        logger.error("Error resolving store reference: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            logger.info("Successfully retrieved {} stores for owner: {}", resolvedStores.size(), email);
            return resolvedStores;
            
        } catch (ResourceNotFoundException e) {
            logger.error("Owner not found error: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error getting stores for owner email {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to get owner stores: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Store createStore(StoreDTO storeDTO) {
        try {
            // Find owner
            Owner owner = storeOwnerRepository.findByEmail(storeDTO.getOwnerEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));

            // Create store
            Store store = new Store();
            store.setStoreId(IdGenerator.generateStoreId());
            store.setName(storeDTO.getName());
            store.setDescription(storeDTO.getDescription());
            store.setOwnerId(owner.getOwnerId());  // Use the OWN format ID
            store.setOwnerEmail(owner.getEmail());
            // ... set other fields
            
            // Save store first
            Store savedStore = storeRepository.save(store);

            // Update owner's stores list using DBRef
            List<Store> ownerStores = owner.getStores();
            if (ownerStores == null) {
                ownerStores = new ArrayList<>();
            }
            ownerStores.add(savedStore);
            owner.setStores(ownerStores);
            storeOwnerRepository.save(owner);

            return savedStore;
        } catch (Exception e) {
            logger.error("Error creating store: {}", e.getMessage());
            throw new RuntimeException("Failed to create store", e);
        }
    }

    public Store getCurrentStoreByOwner(String email) {
        Owner owner = storeOwnerRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
            
        List<Store> stores = owner.getStores();
        if (stores == null || stores.isEmpty()) {
            throw new ResourceNotFoundException("No stores found for owner");
        }
        
        // Return first store (MongoDB will dereference the DBRef)
        return stores.get(0);
    }

    public Store switchStore(String storeId, String email) {
        // Find owner
        Owner owner = storeOwnerRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
            
        // Find store in owner's stores list
        return owner.getStores().stream()
            .filter(store -> store.getId().equals(storeId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
    }

    public Page<Store> searchStores(String query, List<String> categories, List<String> tags, Pageable pageable) {
        return storeRepository.findBySearchCriteria(
            query != null ? query : "",
            categories != null ? categories : Collections.emptyList(),
            tags != null ? tags : Collections.emptyList(),
            pageable
        );
    }
} 