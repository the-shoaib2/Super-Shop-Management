package com.server.model;

import lombok.Data;

@Data
public class Billboard {
    private String id;
    private String content;
    private String image;
    private String link;
    private String type;
    private String status;
    private String createdAt;
    private String updatedAt;
} 