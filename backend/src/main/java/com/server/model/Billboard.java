package com.server.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class Billboard {
    private String id;
    private String content;
    private String image;
    private String link;
    private String type;
    private String status;
    private boolean isEdited;
    private List<String> editedList;
    private String storeId;
    private String storeName;
    private String storeOwnerId;
    private String storeOwnerEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 