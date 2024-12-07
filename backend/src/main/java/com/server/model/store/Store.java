package com.server.model.store;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;
import jakarta.validation.constraints.NotBlank;

import com.server.model.store.products.Product;
import com.server.model.store.products.ProductColor;
import com.server.model.store.products.ProductSize;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "stores")
public class Store {
    @Id
    private String id;
    
    @Indexed
    private String storeId;
    
    @NotBlank(message = "Store name is required")
    private String name;
    
    private String description;
    private String address;
    private String location;
    private String phone;
    private String email;
    private List<String> categories;
    private List<String> tags;
    
    @Indexed
    private String ownerId;
    
    @Indexed
    private String ownerEmail;
    
    @Builder.Default
    @DBRef(lazy = false)
    private List<Product> products = new ArrayList<>();
    
    @Builder.Default
    @DBRef(lazy = false)
    private List<ProductColor> colors = new ArrayList<>();
    
    @Builder.Default
    @DBRef(lazy = false)
    private List<ProductSize> sizes = new ArrayList<>();
    
    @Builder.Default
    @DBRef(lazy = false)
    private List<Billboard> billboards = new ArrayList<>();
    
    @Builder.Default
    @DBRef(lazy = false)
    private List<Category> storeCategories = new ArrayList<>();
    
    @Builder.Default
    @DBRef(lazy = false)
    private List<Price> prices = new ArrayList<>();
    
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public void initializeLists() {
        if (products == null) products = new ArrayList<>();
        if (colors == null) colors = new ArrayList<>();
        if (sizes == null) sizes = new ArrayList<>();
        if (billboards == null) billboards = new ArrayList<>();
        if (storeCategories == null) storeCategories = new ArrayList<>();
        if (prices == null) prices = new ArrayList<>();
        if (categories == null) categories = new ArrayList<>();
        if (tags == null) tags = new ArrayList<>();
    }
} 