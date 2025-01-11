package com.server.model.accounts;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "account_preferences")
@Data
@NoArgsConstructor
public class AccountPreferences {
    @Id
    private String userId;
    
    private String theme = "light";
    private String fontSize = "medium";
    private boolean reducedMotion = false;
    private String language = "en";
    private String timeZone;
    private String dateFormat = "MM/DD/YYYY";
    private boolean emailNotifications = true;
    private boolean pushNotifications = true;
    private boolean marketingEmails = false;
    private String profileVisibility = "public";
    private boolean activityStatus = true;
    private boolean dataSharing = false;
} 