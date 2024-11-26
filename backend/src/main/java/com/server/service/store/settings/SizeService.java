package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.server.repository.ProductSizeRepository;
import com.server.service.store.base.StoreAwareService;
import com.server.exception.ResourceNotFoundException;
import com.server.model.store.products.ProductSize;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class SizeService extends StoreAwareService {
    
    @Autowired
    private ProductSizeRepository sizeRepository;
    
    public List<ProductSize> getSizes() {
        return sizeRepository.findByStoreId(currentStoreId);
    }
    
    public ProductSize createSize(ProductSize size) {
        size.setCreatedAt(LocalDateTime.now());
        size.setUpdatedAt(LocalDateTime.now());
        return sizeRepository.save(size);
    }
    
    public void deleteSize(String sizeId) {
        ProductSize size = sizeRepository.findById(sizeId)
            .orElseThrow(() -> new ResourceNotFoundException("Size not found with id: " + sizeId));
        validateStore(size.getProductId());
        sizeRepository.delete(size);
    }
} 