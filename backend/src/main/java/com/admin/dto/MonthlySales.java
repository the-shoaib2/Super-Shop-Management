package com.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MonthlySales {
    private LocalDate date;
    private BigDecimal amount;

    public MonthlySales(LocalDate date, BigDecimal amount) {
        this.date = date;
        this.amount = amount;
    }

    // Getters and setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
} 