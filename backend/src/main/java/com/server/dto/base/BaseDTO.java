package com.server.dto.base;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public abstract class BaseDTO {
    protected String id;
    protected LocalDateTime createdAt;
    protected LocalDateTime updatedAt;
} 