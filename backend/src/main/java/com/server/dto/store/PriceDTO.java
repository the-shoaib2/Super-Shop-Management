package com.server.dto.store;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class PriceDTO {
    private String id;
    private String storeId;
    private List<String> productIds;
    private Map<String, BigDecimal> amounts;
    private Map<String, BigDecimal> compareAtPrices;
    private String defaultCurrency;
    private boolean isDiscounted;
    private String type;
    
    // Discount information
    private int discountPercentage;
    private LocalDateTime discountStartDate;
    private LocalDateTime discountEndDate;
    private String discountType;
    private String discountDescription;
    
    // Currency information
    @Data
    public static class CurrencyInfo {
        private String code;
        private String symbol;
        private String name;
        private boolean isDefault;
        private double exchangeRate;
    }
    
    private List<CurrencyInfo> currencies;
} 