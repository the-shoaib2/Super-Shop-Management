package com.server.service.store.base;

import org.springframework.beans.factory.annotation.Autowired;

import com.server.exception.common.ResourceNotFoundException;
import com.server.repository.store.StoreRepository;

public abstract class StoreAwareService {
    @Autowired
    protected StoreRepository storeRepository;
    
    protected String currentStoreId;
    
    public void setCurrentStore(String storeId) {
        storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
        this.currentStoreId = storeId;
    }
    
    protected void validateStore(String storeId) {
        if (!storeId.equals(currentStoreId)) {
            throw new ResourceNotFoundException("Resource not found in current store context");
        }
    }
} 