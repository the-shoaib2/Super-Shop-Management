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
        Billboard billboard = billboardRepository.findById(billboardId)
            .orElseThrow(() -> new ResourceNotFoundException("Billboard not found with id: " + billboardId));
        validateStore(billboard.getStoreId());
        billboardRepository.delete(billboard);
    }
    
    public Optional<Billboard> findById(String id) {
        return billboardRepository.findById(id);
    }
} 