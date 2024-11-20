package com.admin.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.text.SimpleDateFormat;
import java.util.Date;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String storeName;
    private String fullName;
    private String email;
    private String token;
    private String loginTime;

    public AuthResponse(String token, String email, String storeName, String fullName) {
        this.token = token;
        this.email = email;
        this.storeName = storeName;
        this.fullName = fullName;
        this.loginTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }
} 