package com.manupedia.controller;

import com.manupedia.dto.ManuscriptResponse;
import com.manupedia.entity.User;
import com.manupedia.service.UserService;
import com.manupedia.service.ManuscriptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ManuscriptService manuscriptService;

    // User Management APIs
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userUpdate) {
        User updatedUser = userService.updateUser(id, userUpdate);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String role = request.get("role");
        User updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }

    // Manuscript Management APIs
    @GetMapping("/manuscripts")
    public ResponseEntity<Page<ManuscriptResponse>> getAllManuscriptsForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ManuscriptResponse> manuscripts = manuscriptService.getAllManuscriptsForAdmin(pageable, status);
        return ResponseEntity.ok(manuscripts);
    }

    @PutMapping("/manuscripts/{id}/status")
    public ResponseEntity<ManuscriptResponse> updateManuscriptStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        ManuscriptResponse updatedManuscript = manuscriptService.updateManuscriptStatus(id, status);
        return ResponseEntity.ok(updatedManuscript);
    }

    @DeleteMapping("/manuscripts/{id}")
    public ResponseEntity<Map<String, String>> deleteManuscriptAsAdmin(@PathVariable Long id) {
        manuscriptService.deleteManuscript(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Manuscript deleted successfully");
        return ResponseEntity.ok(response);
    }

    // System Statistics APIs
    @GetMapping("/statistics/detailed")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getDetailedStatistics() {
        Map<String, Object> stats = new HashMap<>();

        // Get comprehensive system statistics
        Map<String, Object> manuscriptStats = manuscriptService.getStatistics();
        Map<String, Long> userStats = userService.getUserStatistics();

        stats.put("manuscripts", manuscriptStats);
        stats.put("users", userStats);
        stats.put("systemInfo", getSystemInfo());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/statistics/activity")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() {
        List<Map<String, Object>> activity = userService.getRecentActivity();
        return ResponseEntity.ok(activity);
    }

    // System Health and Info
    @GetMapping("/system/health")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "healthy");
        health.put("timestamp", System.currentTimeMillis());
        health.put("uptime", System.currentTimeMillis()); // This would be actual uptime in real system

        return ResponseEntity.ok(health);
    }

    // Helper method for system information
    private Map<String, Object> getSystemInfo() {
        Map<String, Object> systemInfo = new HashMap<>();
        Runtime runtime = Runtime.getRuntime();

        systemInfo.put("javaVersion", System.getProperty("java.version"));
        systemInfo.put("totalMemory", runtime.totalMemory());
        systemInfo.put("freeMemory", runtime.freeMemory());
        systemInfo.put("usedMemory", runtime.totalMemory() - runtime.freeMemory());
        systemInfo.put("processors", runtime.availableProcessors());

        return systemInfo;
    }
}
