package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.server.service.store.base.StoreAwareService;
import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.products.ProductColor;
import com.server.repository.store.products.ProductColorRepository;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class ColorService extends StoreAwareService {
    
    @Autowired
    private ProductColorRepository colorRepository;
    
    public List<ProductColor> getColors() {
        return colorRepository.findByStoreId(currentStoreId);
    }
    
    public ProductColor createColor(ProductColor color) {
        color.setStoreId(currentStoreId);
        color.setCreatedAt(LocalDateTime.now());
        color.setUpdatedAt(LocalDateTime.now());
        return colorRepository.save(color);
    }
    
    public void deleteColor(String colorId) {
        ProductColor color = colorRepository.findById(colorId)
            .orElseThrow(() -> new ResourceNotFoundException("Color not found with id: " + colorId));
        validateStore(color.getStoreId());
        colorRepository.delete(color);
    }
} 