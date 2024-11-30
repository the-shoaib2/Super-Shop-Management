package com.server.service.store.base;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.Store;
import com.server.repository.store.StoreRepository;

import java.time.LocalDateTime;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Transactional
public abstract class AbstractStoreEntityService<T, R extends MongoRepository<T, String>> 
    implements BaseStoreEntityService<T> {
    
    private static final Logger logger = LoggerFactory.getLogger(AbstractStoreEntityService.class);
    
    protected final R repository;
    protected final StoreRepository storeRepository;
    
    protected AbstractStoreEntityService(R repository, StoreRepository storeRepository) {
        this.repository = repository;
        this.storeRepository = storeRepository;
    }
    
    @Override
    public List<T> findAllByStore(String storeId) {
        validateStore(storeId);
        return findByStoreId(storeId);
    }
    
    @Override
    public T findById(String id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Entity not found with id: " + id));
    }
    
    @Override
    @Transactional
    public T create(T entity, String storeId) {
        try {
            Store store = validateStore(storeId);
            setStoreId(entity, storeId);
            setCreatedAt(entity);
            setUpdatedAt(entity);
            
            T savedEntity = repository.save(entity);
            updateStoreEntity(store, savedEntity);
            
            return savedEntity;
        } catch (Exception e) {
            logger.error("Error creating entity for store {}: {}", storeId, e.getMessage());
            throw e;
        }
    }
    
    @Override
    @Transactional
    public T update(String id, T entity) {
        T existing = findById(id);
        String storeId = getStoreId(existing);
        validateStore(storeId);
        
        setStoreId(entity, storeId);
        setUpdatedAt(entity);
        
        return repository.save(entity);
    }
    
    @Override
    @Transactional
    public void delete(String id) {
        T entity = findById(id);
        String storeId = getStoreId(entity);
        validateStore(storeId);
        
        Store store = storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
            
        removeFromStore(store, entity);
        repository.deleteById(id);
    }
    
    protected Store validateStore(String storeId) {
        return storeRepository.findById(storeId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
    }
    
    // Abstract methods to be implemented by specific services
    protected abstract List<T> findByStoreId(String storeId);
    protected abstract void setStoreId(T entity, String storeId);
    protected abstract String getStoreId(T entity);
    protected abstract void setCreatedAt(T entity);
    protected abstract void setUpdatedAt(T entity);
    protected abstract void updateStoreEntity(Store store, T entity);
    protected abstract void removeFromStore(Store store, T entity);
} 