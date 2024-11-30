package com.server.model.store.products;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

import com.server.model.store.Store;

@Data
@Document(collection = "product_colors")
public class ProductColor {
    @Id
    private String id;
    private String name;
    private String value;  // Hex color value
    @Indexed
    private String storeId;
    @DBRef(lazy = true)
    private Store store;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Helper method to set store and storeId together
    public void setStore(Store store) {
        this.store = store;
        this.storeId = store != null ? store.getId() : null;
    }
} 