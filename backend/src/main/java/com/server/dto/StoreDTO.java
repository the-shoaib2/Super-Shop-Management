package com.server.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class StoreDTO {
    private Long id;
    private String name;
    private List<String> type;
    private String description;
    private String address;
    private String location;
    private String phone;
    private String email;
    private List<String> categories;
    private List<String> tags;
    private List<String> images;
    private String ownerId;
    
    @Email(message = "Please provide a valid email address")
    @NotBlank(message = "Owner email is required") 
    private String ownerEmail;
    
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Getters and setters remain the same...
} 