package com.server.model.product;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "product_images")
@Data
public class ProductImage {
    private String id;
    private String url;
    private String alt;
    private Product product;
    private boolean isEdited;
    private List<String> editedList;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 