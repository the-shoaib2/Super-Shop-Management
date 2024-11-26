package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.server.model.store.Billboard;
import com.server.repository.BillboardRepository;
import com.server.service.base.StoreAwareService;
import com.server.exception.ResourceNotFoundException;
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