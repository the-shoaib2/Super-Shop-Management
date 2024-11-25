package com.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import java.util.List;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "stores")
@CompoundIndexes({
    @CompoundIndex(name = "owner_created", def = "{'ownerEmail': 1, 'createdAt': -1}")
})
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
    private String ownerId;
    private boolean isActive;
    
    @Indexed
    private String ownerEmail;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 