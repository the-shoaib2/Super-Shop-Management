package com.server.model.store.products;

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
    private String storeId;
    private String categoryId;
    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private Integer quantity;
    private Integer availableQuantity;
    private List<String> images;
    private List<String> tags;
    
    @DBRef(lazy = true)
    private List<ProductColor> colors;
    
    @DBRef(lazy = true)
    private List<ProductSize> sizes;
    
    private boolean isActive;
    private boolean isFeatured;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 