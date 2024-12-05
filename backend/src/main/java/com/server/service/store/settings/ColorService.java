package com.server.service.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.model.store.products.ProductColor;
import com.server.model.store.Store;
import com.server.repository.store.products.ProductColorRepository;
import com.server.repository.store.StoreRepository;
import com.server.exception.EntityNotFoundException;
import com.server.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ColorService {
    private final ProductColorRepository colorRepository;
    private final StoreRepository storeRepository;

    public List<ProductColor> findAllByStore(String storeId) {
        return colorRepository.findByStoreId(storeId);
    }

    @Transactional
    public ProductColor create(ProductColor color, String storeId) {
        color.setStoreId(storeId);
        ProductColor savedColor = colorRepository.save(color);
        
        // Update store's colors list
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));
        
        if (store.getColors() == null) {
            store.setColors(new ArrayList<>());
        }
        store.getColors().add(savedColor);
        storeRepository.save(store);
        
        return savedColor;
    }

    @Transactional
    public ProductColor update(String storeId, ProductColor updatedColor) {
        // First verify the color exists and belongs to the store
        ProductColor existingColor = colorRepository.findByIdAndStoreId(updatedColor.getId(), storeId)
            .orElseThrow(() -> new EntityNotFoundException(
                "Color not found with id: " + updatedColor.getId() + " for store: " + storeId
            ));

        // Update the fields
        existingColor.setName(updatedColor.getName());
        existingColor.setValue(updatedColor.getValue());
        
        // Save and return the updated color
        return colorRepository.save(existingColor);
    }

    @Transactional
    public void delete(String colorId) {
        if (!colorRepository.existsById(colorId)) {
            throw new EntityNotFoundException("Color not found with id: " + colorId);
        }
        colorRepository.deleteById(colorId);
    }

    public Optional<ProductColor> findById(String id) {
        return colorRepository.findById(id);
    }
} 