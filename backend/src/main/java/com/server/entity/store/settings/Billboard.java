package com.server.entity.store.settings;

import jakarta.persistence.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.server.model.store.Store;

import lombok.Data;

@Document(collection = "billboards")
@Data
public class Billboard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String label;
    private String imageUrl;
    
    @ManyToOne
    private Store store;
    
    @ManyToOne(optional = true)
    private Category category;
} 