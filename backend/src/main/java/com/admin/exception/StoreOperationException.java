package com.admin.exception;

public class StoreOperationException extends RuntimeException {
    public StoreOperationException(String message) {
        super(message);
    }

    public StoreOperationException(String message, Throwable cause) {
        super(message, cause);
    }
} 