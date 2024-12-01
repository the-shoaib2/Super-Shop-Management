package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.server.model.store.products.ProductSize;
import com.server.repository.store.products.ProductSizeRepository;
import com.server.exception.EntityNotFoundException;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SizeService {
    
    @Autowired
    private ProductSizeRepository sizeRepository;
    
    public List<ProductSize> getSizes(String storeId) {
        return sizeRepository.findByStoreId(storeId);
    }
    
    public ProductSize createSize(ProductSize size) {
        size.setCreatedAt(LocalDateTime.now());
        size.setUpdatedAt(LocalDateTime.now());
        return sizeRepository.save(size);
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