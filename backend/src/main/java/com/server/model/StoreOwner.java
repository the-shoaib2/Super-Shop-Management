package com.server.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import java.util.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

@Document(collection = "storeOwners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@CompoundIndex(name = "email_idx", unique = true, def = "{'email': 1}")
public class StoreOwner {
    @Id
    private String id; 
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @Indexed(unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotBlank(message = "Store name is required")
    private String storeName;
    
    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Description is required")
    private String description;

    private String refreshToken;

    private List<String> tags;

    private LocalDateTime lastLogin;


    private List<String> images = new ArrayList<>();

    
    private boolean isActive = true;
    
    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
} 