package com.server.entity.order;

import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import com.server.entity.store.products.Product;

import org.springframework.data.mongodb.core.mapping.DBRef;
import java.math.BigDecimal;

@Data
@Document(collection = "order_products")
public class OrderProduct {
    private String id;
    
    @DBRef
    private Product product;
    
    private Integer quantity;
    private BigDecimal price;
    private String orderId;
    private String storeId;
} 