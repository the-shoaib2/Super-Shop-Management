package com.server.dto;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import com.server.entity.Store;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreWithOwnerDTO {
    private Store store;
    private String ownerName;
    private String ownerEmail;
} 