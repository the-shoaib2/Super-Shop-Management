package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.server.service.store.base.StoreAwareService;
import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.products.ProductColor;
import com.server.repository.store.products.ProductColorRepository;
import com.server.repository.store.StoreRepository;
import com.server.model.store.Store;

import java.util.List;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class ColorService extends StoreAwareService {
    private static final Logger logger = LoggerFactory.getLogger(ColorService.class);
    
    @Autowired
    private ProductColorRepository colorRepository;
    
    @Autowired
    private StoreRepository storeRepository;
    
    public List<ProductColor> getColors() {
        logger.debug("Fetching colors for store: {}", currentStoreId);
        return colorRepository.findByStoreId(currentStoreId);
    }
    
    public ProductColor createColor(ProductColor color) {
        logger.debug("Creating color for store {}: {}", currentStoreId, color);
        
        try {
            // Validate input
            if (color == null) {
                throw new IllegalArgumentException("Color cannot be null");
            }
            if (color.getName() == null || color.getName().trim().isEmpty()) {
                throw new IllegalArgumentException("Color name is required");
            }
            if (color.getValue() == null || color.getValue().trim().isEmpty()) {
                throw new IllegalArgumentException("Color value is required");
            }
            
            // Set store ID and metadata
            color.setStoreId(currentStoreId);
            color.setCreatedAt(LocalDateTime.now());
            color.setUpdatedAt(LocalDateTime.now());
            color.setActive(true);
            
            // Save and log
            ProductColor savedColor = colorRepository.save(color);
            logger.debug("Created color successfully: {}", savedColor);
            return savedColor;
            
        } catch (Exception e) {
            logger.error("Error creating color for store {}: {}", currentStoreId, e.getMessage());
            throw e;
        }
    }
    
    public void deleteColor(String colorId) {
        logger.debug("Deleting color {} for store {}", colorId, currentStoreId);
        
        ProductColor color = colorRepository.findById(colorId)
            .orElseThrow(() -> new ResourceNotFoundException("Color not found with id: " + colorId));
            
        validateStore(color.getStoreId());
        colorRepository.delete(color);
        
        logger.debug("Deleted color {} successfully", colorId);
    }
    
    public ProductColor getColor(String id) {
        logger.debug("Fetching color {} for store {}", id, currentStoreId);
        
        ProductColor color = colorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Color not found with id: " + id));
            
        validateStore(color.getStoreId());
        return color;
    }
    
    public ProductColor updateColor(ProductColor color) {
        logger.debug("Updating color {} for store {}", color.getId(), currentStoreId);
        
        ProductColor existingColor = getColor(color.getId());
        validateStore(existingColor.getStoreId());
        
        color.setStoreId(currentStoreId);
        color.setUpdatedAt(LocalDateTime.now());
        
        ProductColor updatedColor = colorRepository.save(color);
        logger.debug("Updated color: {}", updatedColor);
        return updatedColor;
    }
} 