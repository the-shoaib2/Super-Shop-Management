package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.Category;
import com.server.model.store.Store;
import com.server.model.accounts.Owner;
import com.server.repository.store.settings.CategoryRepository;
import com.server.repository.accounts.StoreOwnerRepository;
import com.server.repository.store.StoreRepository;
import com.server.service.store.base.StoreAwareService;

import java.util.List;
import java.time.LocalDateTime;

@Service
public class CategoryService extends StoreAwareService {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private StoreOwnerRepository storeOwnerRepository;
    
    @Autowired
    private StoreRepository storeRepository;
    
    @Override
    public void setCurrentStore(String storeId) {
        logger.debug("Setting current store ID: {}", storeId);
        
        // First try to find the store directly
        Store store = storeRepository.findById(storeId).orElse(null);
        
        // If not found, look through all owners' stores
        if (store == null) {
            logger.debug("Store not found directly, searching through owners");
            
            // Find owner that has this store
            Owner owner = storeOwnerRepository.findAll().stream()
                .filter(o -> o.getStores() != null && 
                           o.getStores().stream()
                               .anyMatch(s -> s.getId().equals(storeId) || 
                                            s.getStoreId().equals(storeId)))
                .findFirst()
                .orElseThrow(() -> {
                    logger.error("No owner found with store ID: {}", storeId);
                    return new ResourceNotFoundException("Store not found with id: " + storeId);
                });
            
            // Get the store from owner's stores
            store = owner.getStores().stream()
                .filter(s -> s.getId().equals(storeId) || s.getStoreId().equals(storeId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Store not found in owner's stores"));
                
            // Save to store repository if it doesn't exist
            if (!storeRepository.existsById(store.getId())) {
                store = storeRepository.save(store);
                logger.debug("Saved store to repository: {}", store.getId());
            }
        }
            
        this.currentStoreId = store.getId();
        logger.debug("Successfully set current store ID to: {}", this.currentStoreId);
    }
    
    public List<Category> getCategories() {
        logger.debug("Fetching categories for store: {}", currentStoreId);
        return categoryRepository.findByStoreId(currentStoreId);
    }
    
    public Category createCategory(Category category) {
        logger.debug("Creating category for store: {}", currentStoreId);
        
        // Verify store exists
        Store store = storeRepository.findById(currentStoreId)
            .orElseThrow(() -> {
                logger.error("Store not found with ID: {}", currentStoreId);
                return new ResourceNotFoundException("Store not found with id: " + currentStoreId);
            });
            
        category.setStoreId(currentStoreId);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        
        Category savedCategory = categoryRepository.save(category);
        logger.debug("Created category with ID: {} for store: {}", savedCategory.getId(), currentStoreId);
        
        return savedCategory;
    }
    
    public void deleteCategory(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        validateStore(category.getStoreId());
        categoryRepository.delete(category);
        logger.debug("Deleted category: {} from store: {}", categoryId, currentStoreId);
    }

    public Category updateCategory(String categoryId, Category category) {
        logger.debug("Updating category {} for store {}", categoryId, currentStoreId);
        
        Category existingCategory = categoryRepository.findById(categoryId)
            .orElseThrow(() -> {
                logger.error("Category not found with ID: {}", categoryId);
                return new ResourceNotFoundException("Category not found with id: " + categoryId);
            });
        
        validateStore(existingCategory.getStoreId());
        
        // Preserve existing fields and update only what's provided
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setStatus(category.getStatus());
        existingCategory.setType(category.getType());
        existingCategory.setUpdatedAt(LocalDateTime.now());
        
        Category updatedCategory = categoryRepository.save(existingCategory);
        logger.debug("Updated category: {} for store: {}", categoryId, currentStoreId);
        
        return updatedCategory;
    }

    @Override
    protected void validateStore(String storeId) {
        if (!currentStoreId.equals(storeId)) {
            logger.error("Store ID mismatch. Current: {}, Requested: {}", currentStoreId, storeId);
            throw new ResourceNotFoundException("Resource not found in current store context");
        }
    }
} 