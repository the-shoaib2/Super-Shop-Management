package com.server.model;

import lombok.Data;
import java.time.LocalDateTime;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "product_images")
@Data
public class ProductImage {
    private String id;
    private String url;
    private String alt;
    private Product product;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 