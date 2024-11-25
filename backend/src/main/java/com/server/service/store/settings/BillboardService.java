package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.Billboard;
import com.server.repository.store.settings.BillboardRepository;
import com.server.service.store.base.StoreAwareService;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class BillboardService extends StoreAwareService {
    
    @Autowired
    private BillboardRepository billboardRepository;
    
    public List<Billboard> getBillboards() {
        return billboardRepository.findByStoreId(currentStoreId);
    }
    
    public Billboard createBillboard(Billboard billboard) {
        billboard.setStoreId(currentStoreId);
        billboard.setCreatedAt(LocalDateTime.now());
        billboard.setUpdatedAt(LocalDateTime.now());
        return billboardRepository.save(billboard);
    }
    
    public void deleteBillboard(String billboardId) {
        Billboard billboard = billboardRepository.findById(billboardId)
            .orElseThrow(() -> new ResourceNotFoundException("Billboard not found with id: " + billboardId));
        validateStore(billboard.getStoreId());
        billboardRepository.delete(billboard);
    }
} 