package com.server.model.accounts;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Website {
    private String name;
    private String url;
    private LocalDateTime addedAt;

    public Website(String name, String url) {
        this.name = name;
        this.url = url;
        this.addedAt = LocalDateTime.now();
    }
} 