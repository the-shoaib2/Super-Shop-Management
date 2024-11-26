package com.server.entity.order;

import java.math.BigDecimal;

import com.server.entity.store.products.Product;

import lombok.Data;

@Data
public class OrderItem {
    private String productId;
    private Integer quantity;
    private BigDecimal price;
    private Product product;
} 