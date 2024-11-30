package com.server.model.store.products;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "sizes")
public class ProductSize {
    @Id
    private String id;
    private String storeId;
    private String name;
    private String value;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 