package com.server.entity;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class OrderItem {
    private String productId;
    private Integer quantity;
    private BigDecimal price;
    private Product product;
} 