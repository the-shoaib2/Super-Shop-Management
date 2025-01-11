package com.server.specification;

import org.springframework.data.jpa.domain.Specification;

import com.server.model.store.products.Product;


public class ProductSpecification {
    public static Specification<Product> withSearch(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isEmpty()) {
                return cb.isTrue(cb.literal(true));
            }
            
            String searchLike = "%" + search.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), searchLike),
                cb.like(cb.lower(root.get("description")), searchLike)
            );
        };
    }
} 