package com.manupedia.service;

import com.manupedia.dto.ManuscriptResponse;
import com.manupedia.dto.ManuscriptUploadRequest;
import com.manupedia.entity.Manuscript;
import com.manupedia.entity.User;
import com.manupedia.repository.ManuscriptRepository;
import com.manupedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ManuscriptService {

    @Autowired
    private ManuscriptRepository manuscriptRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.upload.dir:${user.home}/manupedia/uploads}")
    private String uploadDir;

    @Value("${app.upload.manuscripts.dir:manuscripts}")
    private String manuscriptsSubDir;

    public ManuscriptResponse uploadManuscript(ManuscriptUploadRequest request,
                                             MultipartFile imageFile,
                                             String username) throws IOException {

        // Find the user
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Create manuscript entity
        Manuscript manuscript = new Manuscript();
        manuscript.setTitle(request.getTitle());
        manuscript.setAuthor(request.getAuthor());
        manuscript.setDateCreated(request.getDateCreated());
        manuscript.setOriginLocation(request.getOriginLocation());
        manuscript.setLanguage(request.getLanguage());
        manuscript.setMaterial(request.getMaterial());
        manuscript.setDimensions(request.getDimensions());
        manuscript.setCondition(request.getCondition());
        manuscript.setDescription(request.getDescription());
        manuscript.setContent(request.getContent());
        manuscript.setUploadedBy(user);

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            String imageInfo = saveImage(imageFile);
            manuscript.setImageUrl("/api/manuscripts/images/" + imageInfo);
            manuscript.setImageFilename(imageInfo);
        }

        // Save manuscript
        Manuscript savedManuscript = manuscriptRepository.save(manuscript);

        return convertToResponse(savedManuscript);
    }

    public ManuscriptResponse updateManuscript(Long id,
                                             ManuscriptUploadRequest request,
                                             MultipartFile imageFile,
                                             String username) throws IOException {

        Manuscript manuscript = manuscriptRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Manuscript not found with id: " + id));

        // Check if user is the owner
        if (!manuscript.getUploadedBy().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to update this manuscript");
        }

        // Update manuscript fields
        manuscript.setTitle(request.getTitle());
        manuscript.setAuthor(request.getAuthor());
        manuscript.setDateCreated(request.getDateCreated());
        manuscript.setOriginLocation(request.getOriginLocation());
        manuscript.setLanguage(request.getLanguage());
        manuscript.setMaterial(request.getMaterial());
        manuscript.setDimensions(request.getDimensions());
        manuscript.setCondition(request.getCondition());
        manuscript.setDescription(request.getDescription());
        manuscript.setContent(request.getContent());
        manuscript.setLastModified(LocalDateTime.now());

        // Handle new image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image if exists
            if (manuscript.getImageFilename() != null) {
                deleteImage(manuscript.getImageFilename());
            }

            String imageInfo = saveImage(imageFile);
            manuscript.setImageUrl("/api/manuscripts/images/" + imageInfo);
            manuscript.setImageFilename(imageInfo);
        }

        Manuscript savedManuscript = manuscriptRepository.save(manuscript);
        return convertToResponse(savedManuscript);
    }

    public ManuscriptResponse getManuscriptById(Long id) {
        Manuscript manuscript = manuscriptRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Manuscript not found with id: " + id));
        return convertToResponse(manuscript);
    }

    public Page<ManuscriptResponse> getAllManuscripts(Pageable pageable) {
        Page<Manuscript> manuscripts = manuscriptRepository.findAllOrderByUploadDateDesc(pageable);
        return manuscripts.map(this::convertToResponse);
    }

    public List<ManuscriptResponse> getUserManuscripts(String username) {
        User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<Manuscript> manuscripts = manuscriptRepository.findByUploadedBy(user);
        return manuscripts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public Page<ManuscriptResponse> searchManuscripts(String title, String author,
                                                    String language, String condition,
                                                    Pageable pageable) {
        Page<Manuscript> manuscripts = manuscriptRepository.searchManuscripts(
            title, author, language, condition, pageable);
        return manuscripts.map(this::convertToResponse);
    }

    public void deleteManuscript(Long id, String username) {
        Manuscript manuscript = manuscriptRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Manuscript not found with id: " + id));

        // Check if user is the owner
        if (!manuscript.getUploadedBy().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this manuscript");
        }

        // Delete associated image if exists
        if (manuscript.getImageFilename() != null) {
            deleteImage(manuscript.getImageFilename());
        }

        manuscriptRepository.delete(manuscript);
    }

    public byte[] getImage(String filename) throws IOException {
        Path imagePath = Paths.get(uploadDir, manuscriptsSubDir, filename);
        if (!Files.exists(imagePath)) {
            throw new RuntimeException("Image not found: " + filename);
        }
        return Files.readAllBytes(imagePath);
    }

    private String saveImage(MultipartFile imageFile) throws IOException {
        // Create upload directories if they don't exist
        Path uploadPath = Paths.get(uploadDir, manuscriptsSubDir);
        Files.createDirectories(uploadPath);

        // Generate unique filename
        String originalFilename = imageFile.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String uniqueFilename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFilename;
    }

    private void deleteImage(String filename) {
        try {
            Path imagePath = Paths.get(uploadDir, manuscriptsSubDir, filename);
            Files.deleteIfExists(imagePath);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete image: " + filename + ", error: " + e.getMessage());
        }
    }

    public Map<String, Object> getStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Total manuscripts count
        long totalManuscripts = manuscriptRepository.count();
        stats.put("totalManuscripts", totalManuscripts);

        // Recent updates (manuscripts updated in last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentUpdates = manuscriptRepository.countByLastModifiedAfter(thirtyDaysAgo);
        stats.put("recentUpdates", recentUpdates);

        // Total contributors (unique users who uploaded manuscripts)
        long totalContributors = userRepository.countUsersWithManuscripts();
        stats.put("totalContributors", totalContributors);

        return stats;
    }

    public List<ManuscriptResponse> getRecentManuscripts(int limit) {
        List<Manuscript> recentManuscripts = manuscriptRepository.findTopByOrderByUploadDateDesc(limit);
        return recentManuscripts.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public ManuscriptResponse getFeaturedManuscript() {
        List<Manuscript> recentManuscripts = manuscriptRepository.findTopByOrderByUploadDateDesc(1);
        if (!recentManuscripts.isEmpty()) {
            return convertToResponse(recentManuscripts.get(0));
        }
        return null; // or throw an exception if no manuscripts exist
    }

    // Admin specific methods
    public Page<ManuscriptResponse> getAllManuscriptsForAdmin(Pageable pageable, String status) {
        Page<Manuscript> manuscripts;
        if (status != null && !status.isEmpty()) {
            // If we had a status field, we would filter by it here
            // For now, just return all manuscripts
            manuscripts = manuscriptRepository.findAll(pageable);
        } else {
            manuscripts = manuscriptRepository.findAll(pageable);
        }
        return manuscripts.map(this::convertToResponse);
    }

    public ManuscriptResponse updateManuscriptStatus(Long id, String status) {
        Manuscript manuscript = manuscriptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manuscript not found with id: " + id));

        // Update status logic would go here if we had a status field
        // For now, just update the last modified time
        manuscript.setLastModified(LocalDateTime.now());

        Manuscript updated = manuscriptRepository.save(manuscript);
        return convertToResponse(updated);
    }

    public void deleteManuscript(Long id) {
        Manuscript manuscript = manuscriptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manuscript not found with id: " + id));

        // Delete associated image file
        if (manuscript.getImageUrl() != null && !manuscript.getImageUrl().isEmpty()) {
            String filename = manuscript.getImageUrl().substring(manuscript.getImageUrl().lastIndexOf('/') + 1);
            deleteImageFile(filename);
        }

        manuscriptRepository.delete(manuscript);
    }

    private void deleteImageFile(String filename) {
        try {
            Path manuscriptImagePath = Paths.get(uploadDir, manuscriptsSubDir, filename);
            Files.deleteIfExists(manuscriptImagePath);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete image file: " + filename + ", error: " + e.getMessage());
        }
    }

    private ManuscriptResponse convertToResponse(Manuscript manuscript) {
        ManuscriptResponse response = new ManuscriptResponse();
        response.setId(manuscript.getId());
        response.setTitle(manuscript.getTitle());
        response.setAuthor(manuscript.getAuthor());
        response.setDateCreated(manuscript.getDateCreated());
        response.setOriginLocation(manuscript.getOriginLocation());
        response.setLanguage(manuscript.getLanguage());
        response.setMaterial(manuscript.getMaterial());
        response.setDimensions(manuscript.getDimensions());
        response.setCondition(manuscript.getCondition());
        response.setDescription(manuscript.getDescription());
        response.setContent(manuscript.getContent());
        response.setImageUrl(manuscript.getImageUrl());
        response.setUploadedByUsername(manuscript.getUploadedBy().getName()); // Using name instead of username
        response.setUploadDate(manuscript.getUploadDate());
        response.setLastModified(manuscript.getLastModified());
        return response;
    }
}
