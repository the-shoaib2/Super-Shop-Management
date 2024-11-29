package com.server.dto.accounts;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AccountPreferencesDTO {
    private String theme;
    private String fontSize;
    private boolean reducedMotion;
    private String language;
    private String timeZone;
    private String dateFormat;
    private boolean emailNotifications;
    private boolean pushNotifications;
    private boolean marketingEmails;
    private String profileVisibility;
    private boolean activityStatus;
    private boolean dataSharing;
} 