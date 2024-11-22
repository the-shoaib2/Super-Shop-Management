package com.server.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
@Document(collection = "stores")
public class Store {
    @Id
    private String id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private String category;
    private List<Product> products;
    private String ownerId;
    private String ownerName;
    private String createdAt;
    private String updatedAt;
    private String logo;
    private boolean isActive;
    private String location;
    private List<String> tags;
    
    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    @NotBlank(message = "Store name is required")
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    @NotBlank(message = "Store description is required")
    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    @NotBlank(message = "Store address is required")
    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    @NotBlank(message = "Store phone is required")
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCategory() {
        return category;
    }

    @NotBlank(message = "Store category is required")
    public void setCategory(String category) {
        this.category = category;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getLocation() {
        return location;
    }

    @NotBlank(message = "Store location is required")
    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }
} 