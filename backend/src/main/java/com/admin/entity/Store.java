package com.admin.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import lombok.Data;

@Data
@Document(collection = "stores")
public class Store {
    @Id
    private String id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String email;
    private List<Product> products;
    private Double rating;
    private Integer reviewCount;
} 