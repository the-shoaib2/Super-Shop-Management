package com.server.service.store;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.server.exception.store.StoreRequirementException;
import com.server.repository.store.products.ProductColorRepository;
import com.server.repository.store.products.ProductSizeRepository;
import com.server.repository.store.settings.BillboardRepository;
import com.server.repository.store.settings.CategoryRepository;
import com.server.repository.store.settings.PriceRepository;

@Service
@RequiredArgsConstructor
public class StoreRequirementsService {
    private static final Logger logger = LoggerFactory.getLogger(StoreRequirementsService.class);
    
    private final ProductColorRepository colorRepository;
    private final ProductSizeRepository sizeRepository;
    private final BillboardRepository billboardRepository;
    private final CategoryRepository categoryRepository;
    private final PriceRepository priceRepository;

    public void checkStoreRequirements(String storeId) {
        
        try {
            // Check if store has colors
            if (colorRepository.findByStoreId(storeId).isEmpty()) {
                throw new StoreRequirementException("Store must have at least one color defined");
            }

            // Check if store has sizes
            if (sizeRepository.findByStoreId(storeId).isEmpty()) {
                throw new StoreRequirementException("Store must have at least one size defined");
            }

            // Check if store has billboards
            if (billboardRepository.findByStoreId(storeId).isEmpty()) {
                throw new StoreRequirementException("Store must have at least one billboard defined");
            }

            // Check if store has categories
            if (categoryRepository.findByStoreId(storeId).isEmpty()) {
                throw new StoreRequirementException("Store must have at least one category defined");
            }

            // Check if store has prices
            if (priceRepository.findByStoreId(storeId).isEmpty()) {
                throw new StoreRequirementException("Store must have at least one price defined");
            }
            
            logger.debug("All store requirements met for storeId: {}", storeId);
        } catch (StoreRequirementException e) {
            logger.error("Store requirement check failed for storeId {}: {}", storeId, e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error checking store requirements for storeId {}", storeId, e);
            throw new StoreRequirementException("Failed to check store requirements: " + e.getMessage());
        }
    }
} 