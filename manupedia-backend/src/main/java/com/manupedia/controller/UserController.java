package com.manupedia.controller;

import com.manupedia.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole().toString());
        profile.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(profile);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getDashboard() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Map<String, String> dashboard = new HashMap<>();
        dashboard.put("message", "Welcome to your dashboard, " + user.getName() + "!");
        dashboard.put("userRole", user.getRole().toString());

        return ResponseEntity.ok(dashboard);
    }
}
