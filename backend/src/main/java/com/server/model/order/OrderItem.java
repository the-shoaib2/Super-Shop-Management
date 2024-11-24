package com.server.model.order;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderItem {
    private String productId;
    private int quantity;
    private BigDecimal price;
    private String storeId;
    private String storeName;
    private String storeOwnerId;
    private BigDecimal discount;
    private BigDecimal totalPrice;
    private BigDecimal discountPercentage;
    private BigDecimal discountPrice;
    private String category;
    private String subCategory;
    private String description;
    private List<String> images;
    private String tags;
    private int totalQuantity;
    private int totalOrder;
    private String createdAt;
    private String updatedAt;
} 