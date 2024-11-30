package com.server.service.store.settings;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.model.store.Store;
import com.server.model.store.products.ProductColor;
import com.server.repository.store.StoreRepository;
import com.server.repository.store.products.ProductColorRepository;
import com.server.service.store.base.AbstractStoreEntityService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ColorService extends AbstractStoreEntityService<ProductColor, ProductColorRepository> {

    public ColorService(ProductColorRepository repository, StoreRepository storeRepository) {
        super(repository, storeRepository);
    }

    @Override
    protected List<ProductColor> findByStoreId(String storeId) {
        return repository.findByStoreId(storeId);
    }

    @Override
    protected void setStoreId(ProductColor color, String storeId) {
        color.setStoreId(storeId);
    }

    @Override
    protected String getStoreId(ProductColor color) {
        return color.getStoreId();
    }

    @Override
    protected void setCreatedAt(ProductColor color) {
        color.setCreatedAt(LocalDateTime.now());
    }

    @Override
    protected void setUpdatedAt(ProductColor color) {
        color.setUpdatedAt(LocalDateTime.now());
    }

    @Override
    protected void updateStoreEntity(Store store, ProductColor color) {
        store.getColors().add(color);
        storeRepository.save(store);
    }

    @Override
    protected void removeFromStore(Store store, ProductColor color) {
        store.getColors().removeIf(c -> c.getId().equals(color.getId()));
        storeRepository.save(store);
    }

    @Override
    public Page<ProductColor> findAllByStorePaginated(String storeId, Pageable pageable) {
        return repository.findByStoreId(storeId, pageable);
    }
} 