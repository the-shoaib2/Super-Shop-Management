package com.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "product_sizes")
public class ProductSize {
    @Id
    private String id;
    private String name;         // S, M, L, XL, etc.
    private String productId;
    private String measurement;  // Actual measurements in cm/inches
    private String sizeType;     // EU, US, UK, etc.
    private Integer quantity;
    private Integer availableQuantity;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 