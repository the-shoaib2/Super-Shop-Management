package com.server.model.store.product;

import lombok.Data;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "product_colors")
public class ProductColor {
    @Id
    private String id;
    private String name;
    private String colorCode;    // Hex code
    private String productId;
    private Integer quantity;
    private Integer availableQuantity;
    private boolean isActive;
    private boolean isEdited;
    private List<String> editedList;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String imageUrl;     // Color-specific product image
} 