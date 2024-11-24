package com.server.model.base;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import java.time.LocalDateTime;

@Data
public abstract class BaseEntity {
    @Id
    protected String id;
    
    @CreatedDate
    protected LocalDateTime createdAt;
    
    @LastModifiedDate
    protected LocalDateTime updatedAt;
} 