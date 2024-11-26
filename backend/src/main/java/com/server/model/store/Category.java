package com.server.model.store;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Data;

@Document(collection = "categories")
@Data
public class Category {
    @Id
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private String bannerUrl;
    private String slug;
    private String rank;
    private String status;
    private String type;
    private String storeId;
    private boolean isEdited;
    private List<String> editedList;
    private List<String> topSellingProducts;
    private String storeName;
    private String storeOwnerId;
    private String storeOwnerEmail;
    private String parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 