package com.server.dto.accounts;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    private String id;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String bio;
    private String avatar;
    private String website;
    private String linkedin;
    private String twitter;
    private boolean emailVerified;
    private boolean emailVisible;
    private boolean phoneVisible;
    private String accountType;
    private String ownerId;
    private AccountPreferencesDTO preferences;
} 