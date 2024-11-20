package com.admin.entity;

import jakarta.persistence.*;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
    
@Document(collection = "categories")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    @ManyToOne
    private Store store;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Product> products;


} 