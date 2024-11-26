package com.server.model.store;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "billboards")
public class Billboard {
    @Id
    private String id;
    private String label;
    private String imageUrl;
    private String description;
    private String storeId;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 