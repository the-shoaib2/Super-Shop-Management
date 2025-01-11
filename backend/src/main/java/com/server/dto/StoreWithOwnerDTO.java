package com.server.dto;

import lombok.Data;
import lombok.Builder;

import com.server.model.store.Store;


import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreWithOwnerDTO {
    private Store store;
    private String ownerName;
    private String ownerEmail;
} 