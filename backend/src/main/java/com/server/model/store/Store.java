package com.server.model.store;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import jakarta.validation.constraints.NotBlank;
import com.server.model.store.products.Product;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "stores")
public class Store {
    @Id
    private String id;
    
    @Indexed(unique = true)
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
    
    @DBRef(lazy = true)
    private List<Product> products;
    
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 