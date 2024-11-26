package com.server.dto.response.store;

import com.server.dto.base.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
public class StoreResponse extends BaseDTO {
    private String name;
    private String description;
    private String ownerEmail;
    private boolean isActive;
    private List<String> categories;
    private List<String> tags;
    private StoreStatsDTO stats;

    @Data
    public static class StoreStatsDTO {
        private Long totalProducts;
        private Long totalOrders;
        private Double revenue;
    }
} 