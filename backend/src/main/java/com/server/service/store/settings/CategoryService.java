package com.server.service.store.settings;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.server.model.store.Category;
import com.server.repository.CategoryRepository;
import com.server.service.base.StoreAwareService;
import com.server.exception.ResourceNotFoundException;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class CategoryService extends StoreAwareService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> getCategories() {
        return categoryRepository.findByStoreId(currentStoreId);
    }
    
    public Category createCategory(Category category) {
        category.setStoreId(currentStoreId);
        category.setCreatedAt(LocalDateTime.now());
        category.setUpdatedAt(LocalDateTime.now());
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        validateStore(category.getStoreId());
        categoryRepository.delete(category);
    }
} 