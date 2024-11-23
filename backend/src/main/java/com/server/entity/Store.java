package com.server.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Document(collection = "stores")
public class Store {
    @Id
    private String id;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ownerEmail;
} 