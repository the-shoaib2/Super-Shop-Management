package com.server.dto.accounts;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountDTO {
    private String id;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String avatar;
    // Add other necessary fields
} 