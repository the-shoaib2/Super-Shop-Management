package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.server.model.store.products.ProductSize;
import com.server.model.store.Store;
import com.server.repository.store.products.ProductSizeRepository;
import com.server.repository.store.StoreRepository;
import com.server.exception.EntityNotFoundException;
import com.server.exception.ResourceNotFoundException;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class SizeService {
    
    @Autowired
    private ProductSizeRepository sizeRepository;
    
    @Autowired
    private StoreRepository storeRepository;
    
    public List<ProductSize> getSizes(String storeId) {
        return sizeRepository.findByStoreId(storeId);
    }
    
    public ProductSize createSize(ProductSize size) {
        size.setCreatedAt(LocalDateTime.now());
        size.setUpdatedAt(LocalDateTime.now());
        ProductSize savedSize = sizeRepository.save(size);
        
        // Update store's sizes list
        Store store = storeRepository.findById(size.getStoreId())
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + size.getStoreId()));
        
        if (store.getSizes() == null) {
            store.setSizes(new ArrayList<>());
        }
        store.getSizes().add(savedSize);
        storeRepository.save(store);
        
        return savedSize;
    }
    
    public ProductSize updateSize(ProductSize size) {
        ProductSize existingSize = sizeRepository.findById(size.getId())
            .orElseThrow(() -> new EntityNotFoundException("Size not found with id: " + size.getId()));
            
        // Verify store ownership
        if (!existingSize.getStoreId().equals(size.getStoreId())) {
            throw new EntityNotFoundException("Size not found in this store");
        }
        
        // Update fields
        existingSize.setName(size.getName());
        existingSize.setValue(size.getValue());
        existingSize.setUpdatedAt(LocalDateTime.now());
        
        return sizeRepository.save(existingSize);
    }
    
    public void deleteSize(String sizeId) {
        ProductSize size = sizeRepository.findById(sizeId)
            .orElseThrow(() -> new EntityNotFoundException("Size not found with id: " + sizeId));
            
        sizeRepository.delete(size);
    }
    
    public Optional<ProductSize> findById(String id) {
        return sizeRepository.findById(id);
    }
} 