package com.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Document(collection = "filters")
@Data
public class Filter {
    @Id
    private Long id;
    private String name;
    private String value;
    private String type;
    private String createdAt;
    private String updatedAt;
} 