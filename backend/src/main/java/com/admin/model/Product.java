package com.admin.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;

@Data
@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private List<String> images;
    private String category;
    private String subCategory;
    private String brand;
    private String color;
    private String size;
    private String tags;
    private String storeId;
    private String storeName;
    private Long totalSales;
    private Integer customerCount;
    private BigDecimal inventoryValue;
    private Integer reviewCount;
    private Double averageRating;
    private Integer recentOrders;
    private List<String> topSellingProducts;
    private List<String> recentReviews;
    private boolean isActive;
} 