package com.admin.repository;

import java.util.List;
import com.admin.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByIsActive(boolean isActive);
} 