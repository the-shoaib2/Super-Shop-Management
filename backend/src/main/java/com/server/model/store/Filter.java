package com.server.model.store;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.Data;

@Document(collection = "filters")
@Data
public class Filter {
    @Id
    private Long id;
    private String name;
    private String value;
    private String type;
    private String storeId;
    private String storeName;
    private String storeOwnerId;
    private String storeOwnerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 