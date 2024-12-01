package com.server.model.store.products;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import com.server.model.store.Billboard;
import com.server.model.store.Category;
import com.server.model.store.Price;

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
    
    @DBRef(lazy = true)
    private Category category;
    
    @DBRef(lazy = true)
    private List<ProductColor> colors;
    
    @DBRef(lazy = true)
    private List<ProductSize> sizes;
    
    @DBRef(lazy = true)
    private List<Price> prices;
    
    @DBRef(lazy = true)
    private List<Billboard> billboards;
    
    private BigDecimal basePrice;
    private BigDecimal salePrice;
    private Integer quantity;
    private Integer availableQuantity;
    private List<String> images;
    private List<String> tags;
    
    private boolean isActive;
    private boolean isFeatured;
    private boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 