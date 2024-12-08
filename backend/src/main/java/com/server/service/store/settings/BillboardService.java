package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.Billboard;
import com.server.repository.store.settings.BillboardRepository;
import com.server.repository.store.StoreRepository;
import com.server.service.store.base.StoreAwareService;
import com.server.model.store.Store;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class BillboardService extends StoreAwareService {
    
    @Autowired
    private BillboardRepository billboardRepository;
    
    @Autowired
    private StoreRepository storeRepository;
    
    public List<Billboard> getBillboards() {
        return billboardRepository.findByStoreId(currentStoreId);
    }
    
    public Billboard createBillboard(Billboard billboard) {
        billboard.setStoreId(currentStoreId);
        billboard.setCreatedAt(LocalDateTime.now());
        billboard.setUpdatedAt(LocalDateTime.now());
        
        // Ensure isActive is explicitly set by user, default to false if not specified
        if (!billboard.isActive()) {
            billboard.setIsActive(false);
        }
        
        Billboard savedBillboard = billboardRepository.save(billboard);
        
        // Update store's billboards list
        Store store = storeRepository.findById(currentStoreId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + currentStoreId));
        
        if (store.getBillboards() == null) {
            store.setBillboards(new ArrayList<>());
        }
        store.getBillboards().add(savedBillboard);
        storeRepository.save(store);
        
        return savedBillboard;
    }
    
    public void deleteBillboard(String billboardId) {
        // Log the billboard ID being deleted
        System.out.println("Attempting to delete billboard with ID: " + billboardId);
        
        Billboard billboard = billboardRepository.findById(billboardId)
            .orElseThrow(() -> {
                System.err.println("Billboard not found with ID: " + billboardId);
                return new ResourceNotFoundException("Billboard not found with id: " + billboardId);
            });
        
        // Log the billboard details
        System.out.println("Found billboard to delete: " + billboard);
        
        validateStore(billboard.getStoreId());
        billboardRepository.delete(billboard);
        
        // Remove billboard from store's billboards list
        Store store = storeRepository.findById(currentStoreId)
            .orElseThrow(() -> {
                System.err.println("Store not found with ID: " + currentStoreId);
                return new ResourceNotFoundException("Store not found with id: " + currentStoreId);
            });
        
        // Log store details before modification
        // System.out.println("Store before billboard removal: " + store);
        // System.out.println("Store billboards before removal: " + store.getBillboards());
        
        // Safely remove billboard, handling potential null elements
        if (store.getBillboards() != null) {
            // Create a new list to avoid ConcurrentModificationException
            List<Billboard> updatedBillboards = new ArrayList<>(store.getBillboards());
            
            // Log initial list size
            // System.out.println("Initial billboards list size: " + updatedBillboards.size());
            
            // Remove billboard
            updatedBillboards.removeIf(b -> {
                // Detailed logging for each billboard
                // System.out.println("Checking billboard: " + b);
                // System.out.println("Billboard ID: " + (b != null ? b.getId() : "null"));
                return b != null && b.getId() != null && b.getId().equals(billboardId);
            });
            
            // Log updated list size
            // System.out.println("Billboards list size after removal: " + updatedBillboards.size());
            
            // Replace the original list with the updated list
            store.setBillboards(updatedBillboards);
        }
        
        // Save the store
        storeRepository.save(store);
        
        System.out.println("Billboard deletion process completed for ID: " + billboardId);
    }
    
    public Optional<Billboard> findById(String id) {
        return billboardRepository.findById(id);
    }
    
    public Billboard updateBillboard(String billboardId, Billboard updatedBillboard) {
        Billboard existingBillboard = billboardRepository.findById(billboardId)
            .orElseThrow(() -> new ResourceNotFoundException("Billboard not found with id: " + billboardId));
        
        // Update fields that can be modified
        existingBillboard.setLabel(updatedBillboard.getLabel());
        existingBillboard.setDescription(updatedBillboard.getDescription());
        existingBillboard.setImageUrl(updatedBillboard.getImageUrl());
        existingBillboard.setActive(updatedBillboard.isActive());    
        existingBillboard.setUpdatedAt(LocalDateTime.now());
        
        return billboardRepository.save(existingBillboard);
    }
}