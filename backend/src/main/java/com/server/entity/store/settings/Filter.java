package com.server.entity.store.settings;

import jakarta.persistence.*;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.server.entity.store.products.Product;

import lombok.Data;

@Document(collection = "filters")
@Data
public class Filter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    @ManyToMany(mappedBy = "filters")
    private Set<Product> products;
} 