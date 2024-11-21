package com.server.util;

import java.util.HashMap;
import java.util.Map;

public class ValidationErrorResponse {
    private boolean success;
    private String message;
    private Map<String, String> data;

    public ValidationErrorResponse() {
        this.success = false;
        this.message = "Validation failed";
        this.data = new HashMap<>();
    }

    public void addError(String field, String message) {
        this.data.put(field, message);
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public Map<String, String> getData() {
        return data;
    }
} 