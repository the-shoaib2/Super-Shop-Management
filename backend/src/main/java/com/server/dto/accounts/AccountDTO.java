package com.server.dto.accounts;

import java.util.List;
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
    private String description;
    private String image;
    private String ownerId;
    private List<String> websiteList;
    private AccountPreferencesDTO preferences;
} 