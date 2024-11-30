package com.server.service.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.server.exception.common.ResourceNotFoundException;
import com.server.model.store.Price;
import com.server.repository.store.settings.PriceRepository;
import com.server.service.store.base.StoreAwareService;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PriceService extends StoreAwareService {
    private final PriceRepository priceRepository;

    public List<Price> getPrices() {
        return priceRepository.findByStoreId(currentStoreId);
    }

    public Price getPrice(String id) {
        Price price = priceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Price not found with id: " + id));
        validateStore(price.getStoreId());
        return price;
    }

    public Price createPrice(Price price) {
        price.setStoreId(currentStoreId);
        price.setCreatedAt(LocalDateTime.now());
        price.setUpdatedAt(LocalDateTime.now());
        return priceRepository.save(price);
    }

    public Price updatePrice(Price price) {
        Price existingPrice = getPrice(price.getId());
        validateStore(existingPrice.getStoreId());
        
        price.setStoreId(currentStoreId);
        price.setUpdatedAt(LocalDateTime.now());
        return priceRepository.save(price);
    }

    public void deletePrice(String id) {
        Price price = getPrice(id);
        validateStore(price.getStoreId());
        priceRepository.deleteById(id);
    }
} 