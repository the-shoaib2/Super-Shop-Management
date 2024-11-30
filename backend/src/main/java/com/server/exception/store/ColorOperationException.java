package com.server.exception.store;

public class ColorOperationException extends RuntimeException {
    public ColorOperationException(String message) {
        super(message);
    }

    public ColorOperationException(String message, Throwable cause) {
        super(message, cause);
    }
} 