package com.server.dto.accounts;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.server.model.accounts.Website;

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
    // @JsonProperty("avatarUrl")
    private String avatarUrl;
    private String ownerId;
    @Builder.Default
    private List<Website> websites = new ArrayList<>();
    
    // @JsonProperty("isEmailVisible")
    private boolean isEmailVisible;
    
    // @JsonProperty("isPhoneVisible")
    private boolean isPhoneVisible;
    
    // @JsonProperty("isActive")
    private boolean isActive;
    
    // @JsonProperty("isOnline")
    private boolean isOnline;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private LocalDateTime lastActive;
    
    private AccountPreferencesDTO preferences;
} 