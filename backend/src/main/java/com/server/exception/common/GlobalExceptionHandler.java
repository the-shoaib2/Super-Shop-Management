package com.server.exception.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.data.mongodb.UncategorizedMongoDbException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import com.server.exception.base.BaseException;
import com.server.exception.store.StoreOperationException;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<Map<String, String>> handleBaseException(BaseException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        error.put("errorCode", e.getErrorCode());
        error.put("type", e.getClass().getSimpleName());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        error.put("type", "GeneralError");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UncategorizedMongoDbException.class)
    public ResponseEntity<Map<String, String>> handleMongoException(UncategorizedMongoDbException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "Database operation failed");
        error.put("type", "DatabaseError");
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleMaxSizeException(MaxUploadSizeExceededException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", "File size exceeds maximum limit");
        error.put("type", "FileUploadError");
        return new ResponseEntity<>(error, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    @ExceptionHandler(StoreOperationException.class)
    public ResponseEntity<Map<String, String>> handleStoreOperationException(StoreOperationException e) {
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());
        error.put("errorCode", e.getErrorCode());
        error.put("type", "StoreOperationError");
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
} 