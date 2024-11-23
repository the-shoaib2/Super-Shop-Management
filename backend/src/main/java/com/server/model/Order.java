package com.server.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String customerId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime orderDate;
    private String shippingAddress;
    private String paymentMethod;
    private String paymentStatus;
    private String deliveryStatus;
    private String totalDiscount;
    private String totalPrice;
    private String totalDiscountPrice;
    private String totalOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 