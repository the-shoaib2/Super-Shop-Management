package com.server.model.product;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer quantity;
    private Integer availableQuantity;
    private Integer returnedQuantity;
    private List<String> images;
    private String category;
    private String subCategory;
    private String brand;
    
    // References to new entities
    @DBRef
    private List<ProductColor> colors;
    
    @DBRef
    private List<ProductSize> sizes;
    
    @DBRef
    private ProductSpecification specifications;
    
    private String storeId;
    private String storeName;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Product statistics
    private Long totalSales;
    private Integer customerCount;
    private BigDecimal inventoryValue;
    private Integer reviewCount;
    private Double averageRating;
    private Integer recentOrders;
    private Integer returnRate;
    
    // Return policy
    private boolean returnable;
    private Integer returnPeriod;
    private String returnPolicy;

    public void updateAvailableQuantity() {
        this.availableQuantity = this.quantity - (this.returnedQuantity != null ? this.returnedQuantity : 0);
    }

    public boolean hasStock() {
        return this.availableQuantity > 0;
    }

    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        updateAvailableQuantity();
        if (returnedQuantity == null) returnedQuantity = 0;
        if (totalSales == null) totalSales = 0L;
        if (customerCount == null) customerCount = 0;
        if (reviewCount == null) reviewCount = 0;
        if (returnRate == null) returnRate = 0;
    }
} 