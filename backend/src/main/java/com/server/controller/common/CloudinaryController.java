package com.server.controller.common;

import com.server.service.storage.CloudinaryService;
import com.server.util.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
// @CrossOrigin(origins = {"${admin.frontend.url}", "${store.frontend.url}"})

public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false) String folder,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("User not authenticated", null));
            }

            Map<String, String> result = cloudinaryService.uploadImage(file, folder);
            return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to upload image: " + e.getMessage(), null));
        }
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> uploadMultipleImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "folder", required = false) String folder) {
        try {
            List<Map<String, String>> results = cloudinaryService.uploadMultipleImages(files, folder);
            return ResponseEntity.ok(ApiResponse.success("Images uploaded successfully", results));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to upload images: " + e.getMessage(), null));
        }
    }

    @DeleteMapping("/image")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteImage(
            @RequestParam("publicId") String publicId) {
        try {
            Map<String, String> result = cloudinaryService.deleteImage(publicId);
            return ResponseEntity.ok(ApiResponse.success("Image deleted successfully", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(ApiResponse.error("Failed to delete image: " + e.getMessage(), null));
        }
    }
} 