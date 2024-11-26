package com.server.model.store;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.persistence.PrePersist;

@Data
@Document(collection = "stores")
public class Store {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String storeId;
    
    private String name;
    private List<String> type;
    private String description;
    private String address;
    private String location;
    private String phone;
    private String email;
    private List<String> categories;
    private List<String> tags;
    private List<String> images;
    
    @Indexed
    private String ownerId;
    
    @Indexed
    private String ownerEmail;
    
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }
} 