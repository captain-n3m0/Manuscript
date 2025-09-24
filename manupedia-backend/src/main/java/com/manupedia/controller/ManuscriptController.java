package com.manupedia.controller;

import com.manupedia.dto.ManuscriptResponse;
import com.manupedia.dto.ManuscriptUploadRequest;
import com.manupedia.service.ManuscriptService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manuscripts")
@CrossOrigin(origins = "http://localhost:3000")
public class ManuscriptController {

    @Autowired
    private ManuscriptService manuscriptService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadManuscript(
            @RequestPart("manuscript") @Valid ManuscriptUploadRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ManuscriptResponse response = manuscriptService.uploadManuscript(request, imageFile, username);

            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("message", "Manuscript uploaded successfully");
            successResponse.put("manuscript", response);

            return ResponseEntity.status(HttpStatus.CREATED).body(successResponse);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateManuscript(
            @PathVariable Long id,
            @RequestPart("manuscript") @Valid ManuscriptUploadRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            ManuscriptResponse response = manuscriptService.updateManuscript(id, request, imageFile, username);

            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("message", "Manuscript updated successfully");
            successResponse.put("manuscript", response);

            return ResponseEntity.ok(successResponse);
        } catch (IOException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getManuscript(@PathVariable Long id) {
        try {
            ManuscriptResponse response = manuscriptService.getManuscriptById(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @GetMapping
    public ResponseEntity<Page<ManuscriptResponse>> getAllManuscripts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ManuscriptResponse> manuscripts = manuscriptService.getAllManuscripts(pageable);
        return ResponseEntity.ok(manuscripts);
    }

    @GetMapping("/my-manuscripts")
    public ResponseEntity<?> getUserManuscripts(Authentication authentication) {
        try {
            String username = authentication.getName();
            List<ManuscriptResponse> manuscripts = manuscriptService.getUserManuscripts(username);
            return ResponseEntity.ok(manuscripts);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ManuscriptResponse>> searchManuscripts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String language,
            @RequestParam(required = false) String condition,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ManuscriptResponse> manuscripts = manuscriptService.searchManuscripts(
            title, author, language, condition, pageable);
        return ResponseEntity.ok(manuscripts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteManuscript(@PathVariable Long id, Authentication authentication) {
        try {
            String username = authentication.getName();
            manuscriptService.deleteManuscript(id, username);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Manuscript deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageData = manuscriptService.getImage(filename);

            // Determine content type based on file extension
            String contentType = "image/jpeg"; // default
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (filename.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(contentType));
            headers.setContentLength(imageData.length);

            return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        try {
            Map<String, Object> stats = manuscriptService.getStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Failed to fetch statistics");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ManuscriptResponse>> getRecentManuscripts(
            @RequestParam(defaultValue = "5") int limit) {
        try {
            List<ManuscriptResponse> recentManuscripts = manuscriptService.getRecentManuscripts(limit);
            return ResponseEntity.ok(recentManuscripts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/featured")
    public ResponseEntity<ManuscriptResponse> getFeaturedManuscript() {
        try {
            ManuscriptResponse featured = manuscriptService.getFeaturedManuscript();
            if (featured != null) {
                return ResponseEntity.ok(featured);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Manuscript API is working!");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }
}
