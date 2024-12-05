package com.server.service.store.settings;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import com.server.model.store.Price;
import com.server.model.store.Store;
import com.server.repository.store.settings.PriceRepository;
import com.server.repository.store.StoreRepository;
import com.server.exception.ResourceNotFoundException;

import java.util.List;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class PriceService {
    private final PriceRepository priceRepository;
    private final StoreRepository storeRepository;
    private final MongoTemplate mongoTemplate;
    private String currentStoreId;

    public void setCurrentStore(String storeId) {
        this.currentStoreId = storeId;
    }

    public List<Price> getPrices() {
        Query query = new Query(Criteria.where("storeId").is(currentStoreId));
        return mongoTemplate.find(query, Price.class);
    }

    public Price getPrice(String id) {
        return priceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Price not found"));
    }

    public Price createPrice(Price price) {
        price.setStoreId(currentStoreId);
        price.setCreatedAtIfNull();
        price.calculateAllDiscounts();
        Price savedPrice = priceRepository.save(price);
        
        // Update store's prices list
        Store store = storeRepository.findById(currentStoreId)
            .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + currentStoreId));
        
        if (store.getPrices() == null) {
            store.setPrices(new ArrayList<>());
        }
        store.getPrices().add(savedPrice);
        storeRepository.save(store);
        
        return savedPrice;
    }

    public Price updatePrice(Price price) {
        Price existing = getPrice(price.getId());
        
        // Validate store ownership
        if (!existing.getStoreId().equals(currentStoreId)) {
            throw new IllegalArgumentException("Price does not belong to current store");
        }

        price.setStoreId(currentStoreId);
        price.setCreatedAt(existing.getCreatedAt());
        price.setUpdatedAt(LocalDateTime.now());
        price.calculateAllDiscounts();
        
        return priceRepository.save(price);
    }

    public void deletePrice(String id) {
        Price price = getPrice(id);
        
        // Validate store ownership
        if (!price.getStoreId().equals(currentStoreId)) {
            throw new IllegalArgumentException("Price does not belong to current store");
        }

        priceRepository.deleteById(id);
    }

    // Get prices by product
    public List<Price> getPricesByProduct(String productId) {
        Query query = new Query(Criteria.where("storeId").is(currentStoreId)
            .and("productIds").in(productId));
        return mongoTemplate.find(query, Price.class);
    }

    // Get active prices
    public List<Price> getActivePrices() {
        Query query = new Query(Criteria.where("storeId").is(currentStoreId)
            .and("isActive").is(true));
        return mongoTemplate.find(query, Price.class);
    }

    // Get discounted prices
    public List<Price> getDiscountedPrices() {
        Query query = new Query(Criteria.where("storeId").is(currentStoreId)
            .and("isDiscounted").is(true)
            .and("isActive").is(true));
        return mongoTemplate.find(query, Price.class);
    }

    // Add product to price
    public Price addProductToPrice(String priceId, String productId) {
        Price price = getPrice(priceId);
        price.addProduct(productId);
        return priceRepository.save(price);
    }

    // Remove product from price
    public Price removeProductFromPrice(String priceId, String productId) {
        Price price = getPrice(priceId);
        price.removeProduct(productId);
        return priceRepository.save(price);
    }

    // Get prices with multiple products
    public List<Price> getPricesWithMultipleProducts() {
        Query query = new Query(Criteria.where("storeId").is(currentStoreId)
            .and("productIds").exists(true)
            .and("productIds").not().size(0));
        return mongoTemplate.find(query, Price.class);
    }

    // Update price for multiple products
    public Price updatePriceForProducts(String priceId, List<String> productIds) {
        Price price = getPrice(priceId);
        price.setProductIds(productIds);
        return priceRepository.save(price);
    }

    public Optional<Price> findById(String id) {
        return priceRepository.findById(id);
    }
} 