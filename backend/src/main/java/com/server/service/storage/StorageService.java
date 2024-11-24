package com.server.service.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class StorageService {
    private final Path rootLocation = Paths.get("uploads");

    public StorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    public String store(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }
            Path destinationFile = this.rootLocation.resolve(
                Paths.get(file.getOriginalFilename())
            ).normalize().toAbsolutePath();
            
            Files.copy(file.getInputStream(), destinationFile);
            
            return destinationFile.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    public String storeFile(MultipartFile file, String directory) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }
            Path destinationFile = Paths.get(directory).resolve(file.getOriginalFilename()).normalize().toAbsolutePath();
            Files.copy(file.getInputStream(), destinationFile);
            
            return destinationFile.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
} 