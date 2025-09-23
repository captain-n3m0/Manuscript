package com.manupedia.controller;

import com.manupedia.dto.ImageResponse;
import com.manupedia.dto.ManualUploadRequest;
import com.manupedia.entity.Manual;
import com.manupedia.service.ManualService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/manuals")
@CrossOrigin(origins = "http://localhost:3000")
public class ManualController {

    @Autowired
    private ManualService manualService;

    @GetMapping("/featured")
    public ResponseEntity<?> getFeaturedManuscripts() {
        try {
            return ResponseEntity.ok(manualService.getFeaturedManuscripts());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/feature")
    public ResponseEntity<?> toggleFeatureStatus(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            Manual manual = manualService.toggleFeatureStatus(id);
            return ResponseEntity.ok(manual);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> uploadManual(
            @Valid @RequestBody ManualUploadRequest request,
            Authentication authentication) {
        try {
            Manual savedManual = manualService.uploadManual(request, authentication.getName());
            return ResponseEntity.ok(savedManual);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload");
            }

            if (!file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            ImageResponse response = ImageResponse.builder()
                .imageType(file.getContentType())
                .imageData(file.getBytes())
                .build();

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to process image: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<?> getImage(@PathVariable Long id) {
        try {
            Manual manual = manualService.getManualById(id);
            
            if (manual.getImageData() == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(manual.getImageType()))
                .body(manual.getImageData());

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to retrieve image: " + e.getMessage());
        }
    }
}