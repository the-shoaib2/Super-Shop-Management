package com.server.model.store.products;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Document(collection = "product_specifications")
public class ProductSpecification {
    @Id
    private String id;
    private String productId;
    private String category;     // Technical, Physical, Material, etc.
    private Map<String, String> specifications;  // Key-value pairs of specifications
    private String description;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Example specifications:
    // Material: "Cotton"
    // Weight: "200g"
    // Dimensions: "10x20x30 cm"
    // Care Instructions: "Machine wash cold"
} 