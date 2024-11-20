package com.admin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageService {
    
    private final Path rootLocation;

    public ImageService(@Value("${app.upload.dir}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir);
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String saveImage(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }
            
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.rootLocation.resolve(filename));
            return filename;
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public Path load(String filename) {
        return rootLocation.resolve(filename);
    }

    public void deleteImage(String filename) {
        try {
            Files.deleteIfExists(this.rootLocation.resolve(filename));
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
} 