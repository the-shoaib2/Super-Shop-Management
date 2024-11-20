package com.admin.model;

import java.util.List;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import lombok.Data;

@Document(collection = "categories")
@Data
public class Category {
    @Id
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private String bannerUrl;
    private String slug;
    private String rank;
    private String status;
    private String type;
    private List<String> topSellingProducts;
    private String parentId;
    private String createdAt;
    private String updatedAt;
} 