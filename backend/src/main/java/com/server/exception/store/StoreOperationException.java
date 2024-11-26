package com.server.exception.store;

import com.server.exception.base.BaseException;

public class StoreOperationException extends BaseException {
    public StoreOperationException(String message) {
        super(message, "STORE_OPERATION_ERROR");
    }

    public StoreOperationException(String message, Throwable cause) {
        super(message, "STORE_OPERATION_ERROR", cause);
    }
} 