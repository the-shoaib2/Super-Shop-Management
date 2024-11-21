package com.server.dto;

import lombok.Data;

@Data
public class StoreStats {
    // Add relevant fields, getters, setters
    public void setCustomerCount(Integer customerCount) {
        this.customerCount = customerCount;
    }
    
    



    private Long totalSales;
    private Integer customerCount;
    
    
    // Getters and setters
    
} 