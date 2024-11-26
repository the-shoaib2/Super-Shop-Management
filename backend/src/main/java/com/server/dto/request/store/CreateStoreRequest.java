package com.server.dto.request.store;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;
import java.util.List;

@Data
public class CreateStoreRequest {
    @NotBlank(message = "Store name is required")
    private String name;
    
    private String description;
    
    @Email(message = "Valid owner email is required")
    private String ownerEmail;
    
    private List<String> categories;
    private List<String> tags;
} 