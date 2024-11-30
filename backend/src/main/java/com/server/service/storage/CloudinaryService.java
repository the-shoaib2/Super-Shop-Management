package com.server.service.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public Map<String, String> uploadImage(MultipartFile file, String folder) throws IOException {
        try {
            Map<String, Object> options = new HashMap<>();
            if (folder != null && !folder.isEmpty()) {
                options.put("folder", folder);
            }
            
            Map<?, ?> uploadResult = cloudinary.uploader()
                .upload(file.getBytes(), options);

            Map<String, String> result = new HashMap<>();
            result.put("publicId", (String) uploadResult.get("public_id"));
            result.put("url", (String) uploadResult.get("secure_url"));
            result.put("format", (String) uploadResult.get("format"));
            result.put("width", String.valueOf(uploadResult.get("width")));
            result.put("height", String.valueOf(uploadResult.get("height")));
            
            return result;
        } catch (IOException e) {
            throw new IOException("Failed to upload image to Cloudinary", e);
        }
    }

    public List<Map<String, String>> uploadMultipleImages(List<MultipartFile> files, String folder) {
        List<Map<String, String>> results = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                Map<String, String> result = uploadImage(file, folder);
                results.add(result);
            } catch (IOException e) {
                // Log error but continue with remaining files
                e.printStackTrace();
            }
        }
        return results;
    }

    public Map<String, String> deleteImage(String publicId) throws IOException {
        try {
            Map<?, ?> result = cloudinary.uploader()
                .destroy(publicId, ObjectUtils.emptyMap());
            
            Map<String, String> response = new HashMap<>();
            response.put("result", (String) result.get("result"));
            return response;
        } catch (IOException e) {
            throw new IOException("Failed to delete image from Cloudinary", e);
        }
    }
} 