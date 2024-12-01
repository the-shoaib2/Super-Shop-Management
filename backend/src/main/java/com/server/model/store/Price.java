package com.server.model.store;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

@Data
@Document(collection = "prices")
public class Price {
    @Id
    private String id;
    private String storeId;
    private List<String> productIds = new ArrayList<>();
    
    // Currency amounts for different currencies
    private Map<String, BigDecimal> amounts = new HashMap<>();
    
    // Old prices history
    @Data
    public static class PriceHistory {
        private BigDecimal amount;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String currencyCode;
        private String reason; // e.g., "Sale", "Seasonal", "Clearance"
    }
    
    private List<PriceHistory> priceHistory = new ArrayList<>();
    
    // Discount information
    @Data
    public static class DiscountInfo {
        private int percentage;
        private BigDecimal discountedAmount;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private String type; // e.g., "Flash Sale", "Seasonal", "Clearance"
        private String description;
        private boolean isActive;
    }
    
    private Map<String, DiscountInfo> discounts = new HashMap<>(); // Currency code -> Discount info
    
    // Currency information
    @Data
    public static class CurrencyInfo {
        private String code;        // e.g., "BDT", "USD"
        private String symbol;      // e.g., "৳", "$"
        private String name;        // e.g., "Bangladeshi Taka", "US Dollar"
        private boolean isDefault;  // Is this the default currency?
        private double exchangeRate;// Exchange rate relative to default currency
    }
    
    private List<CurrencyInfo> currencies = new ArrayList<>();
    private String defaultCurrency = "BDT"; // Default currency code
    
    // Compare at prices for different currencies
    private Map<String, BigDecimal> compareAtPrices = new HashMap<>();
    
    private boolean isDiscounted;
    private Map<String, Integer> discountPercentages = new HashMap<>(); // Discount % by currency
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive = true;
    private String type;
    
    // Initialize with default Bangladesh Taka
    public Price() {
        CurrencyInfo bdt = new CurrencyInfo();
        bdt.setCode("BDT");
        bdt.setSymbol("৳");
        bdt.setName("Bangladeshi Taka");
        bdt.setDefault(true);
        bdt.setExchangeRate(1.0);
        currencies.add(bdt);
    }
    
    // Add price history entry
    public void addPriceHistory(String currencyCode, BigDecimal oldAmount, String reason) {
        PriceHistory history = new PriceHistory();
        history.setAmount(oldAmount);
        history.setCurrencyCode(currencyCode);
        history.setStartDate(LocalDateTime.now());
        history.setReason(reason);
        priceHistory.add(history);
    }
    
    // Add or update discount
    public void setDiscount(String currencyCode, int percentage, LocalDateTime endDate, String type) {
        BigDecimal amount = amounts.get(currencyCode);
        if (amount != null) {
            DiscountInfo discount = new DiscountInfo();
            discount.setPercentage(percentage);
            discount.setStartDate(LocalDateTime.now());
            discount.setEndDate(endDate);
            discount.setType(type);
            discount.setActive(true);
            
            // Calculate discounted amount
            BigDecimal discountAmount = amount.multiply(BigDecimal.valueOf(percentage))
                .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
            discount.setDiscountedAmount(amount.subtract(discountAmount));
            
            discounts.put(currencyCode, discount);
            isDiscounted = true;
        }
    }
    
    // Remove discount
    public void removeDiscount(String currencyCode) {
        discounts.remove(currencyCode);
        isDiscounted = !discounts.isEmpty();
    }
    
    // Get current discounted price
    public BigDecimal getDiscountedPrice(String currencyCode) {
        DiscountInfo discount = discounts.get(currencyCode);
        if (discount != null && discount.isActive) {
            return discount.getDiscountedAmount();
        }
        return amounts.get(currencyCode);
    }
    
    // Check if price has active discount
    public boolean hasActiveDiscount(String currencyCode) {
        DiscountInfo discount = discounts.get(currencyCode);
        return discount != null && discount.isActive && 
               (discount.getEndDate() == null || discount.getEndDate().isAfter(LocalDateTime.now()));
    }
    
    // Get price history for a currency
    public List<PriceHistory> getPriceHistory(String currencyCode) {
        List<PriceHistory> history = new ArrayList<>();
        for (PriceHistory entry : priceHistory) {
            if (entry.getCurrencyCode().equals(currencyCode)) {
                history.add(entry);
            }
        }
        return history;
    }
    
    // Add a new currency
    public void addCurrency(String code, String symbol, String name, double exchangeRate) {
        CurrencyInfo currency = new CurrencyInfo();
        currency.setCode(code);
        currency.setSymbol(symbol);
        currency.setName(name);
        currency.setDefault(false);
        currency.setExchangeRate(exchangeRate);
        currencies.add(currency);
    }
    
    // Set amount for a specific currency
    public void setAmount(String currencyCode, BigDecimal amount) {
        // Store old price in history before updating
        BigDecimal oldAmount = amounts.get(currencyCode);
        if (oldAmount != null) {
            addPriceHistory(currencyCode, oldAmount, "Price Update");
        }
        
        amounts.put(currencyCode, amount);
        calculateDiscountForCurrency(currencyCode);
    }
    
    // Get amount in specific currency
    public BigDecimal getAmount(String currencyCode) {
        return amounts.getOrDefault(currencyCode, BigDecimal.ZERO);
    }
    
    // Set compare-at price for a specific currency
    public void setCompareAtPrice(String currencyCode, BigDecimal price) {
        compareAtPrices.put(currencyCode, price);
        calculateDiscountForCurrency(currencyCode);
    }
    
    // Calculate discount for specific currency
    public void calculateDiscountForCurrency(String currencyCode) {
        BigDecimal amount = amounts.get(currencyCode);
        BigDecimal compareAt = compareAtPrices.get(currencyCode);
        
        if (amount != null && compareAt != null && compareAt.compareTo(BigDecimal.ZERO) > 0) {
            boolean hasDiscount = compareAt.compareTo(amount) > 0;
            isDiscounted = isDiscounted || hasDiscount;
            
            if (hasDiscount) {
                BigDecimal discount = compareAt.subtract(amount)
                    .multiply(new BigDecimal(100))
                    .divide(compareAt, 0, BigDecimal.ROUND_HALF_UP);
                discountPercentages.put(currencyCode, discount.intValue());
            }
        }
    }
    
    // Calculate all discounts
    public void calculateAllDiscounts() {
        isDiscounted = false;
        for (String currencyCode : amounts.keySet()) {
            calculateDiscountForCurrency(currencyCode);
        }
    }
    
    // Get discount percentage for specific currency
    public int getDiscountPercentage(String currencyCode) {
        return discountPercentages.getOrDefault(currencyCode, 0);
    }
    
    // Product management methods
    public void addProduct(String productId) {
        if (productIds == null) {
            productIds = new ArrayList<>();
        }
        if (!productIds.contains(productId)) {
            productIds.add(productId);
        }
    }

    public void removeProduct(String productId) {
        if (productIds != null) {
            productIds.remove(productId);
        }
    }

    public boolean hasProduct(String productId) {
        return productIds != null && productIds.contains(productId);
    }

    public int getProductCount() {
        return productIds != null ? productIds.size() : 0;
    }

    public void clearProducts() {
        if (productIds != null) {
            productIds.clear();
        }
    }

    public void setCreatedAtIfNull() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }
} 