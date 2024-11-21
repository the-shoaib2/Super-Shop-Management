package com.server.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class ValidationErrorResponse {
    private List<FieldError> errors = new ArrayList<>();

    public void addError(String field, String message) {
        errors.add(new FieldError(field, message));
    }

    @Data
    public static class FieldError {
        private final String field;
        private final String message;
    }
} 