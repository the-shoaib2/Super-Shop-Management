package com.server.exception.auth;

import com.server.exception.base.BaseException;

public class UserAlreadyExistsException extends BaseException {
    public UserAlreadyExistsException(String message) {
        super(message, "USER_EXISTS");
    }
} 