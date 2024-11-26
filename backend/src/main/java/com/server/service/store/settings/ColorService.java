package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.server.model.store.product.ProductColor;
import com.server.repository.ProductColorRepository;
import com.server.service.base.StoreAwareService;
import com.server.exception.ResourceNotFoundException;
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
        color.setCreatedAt(LocalDateTime.now());
        color.setUpdatedAt(LocalDateTime.now());
        return colorRepository.save(color);
    }
    
    public void deleteColor(String colorId) {
        ProductColor color = colorRepository.findById(colorId)
            .orElseThrow(() -> new ResourceNotFoundException("Color not found with id: " + colorId));
        validateStore(color.getProductId());
        colorRepository.delete(color);
    }
} 