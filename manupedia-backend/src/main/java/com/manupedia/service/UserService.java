package com.manupedia.service;

import com.manupedia.entity.User;
import com.manupedia.repository.UserRepository;
import com.manupedia.repository.ManuscriptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ManuscriptRepository manuscriptRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user;
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // Admin methods
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateUser(Long id, User userUpdate) {
        User existingUser = getUserById(id);

        if (userUpdate.getName() != null) {
            existingUser.setName(userUpdate.getName());
        }
        if (userUpdate.getEmail() != null && !userUpdate.getEmail().equals(existingUser.getEmail())) {
            if (existsByEmail(userUpdate.getEmail())) {
                throw new RuntimeException("Email already exists");
            }
            existingUser.setEmail(userUpdate.getEmail());
        }

        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    public User updateUserRole(Long id, String role) {
        User user = getUserById(id);
        try {
            User.Role newRole = User.Role.valueOf(role.toUpperCase());
            user.setRole(newRole);
            return userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + role);
        }
    }

    public Map<String, Long> getUserStatistics() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("adminUsers", userRepository.countByRole("ADMIN"));
        stats.put("regularUsers", userRepository.countByRole("USER"));
        return stats;
    }

    public List<Map<String, Object>> getRecentActivity() {
        List<Map<String, Object>> activities = new ArrayList<>();

        // Get recent users (last 10)
        List<User> recentUsers = userRepository.findTop10ByOrderByIdDesc();
        for (User user : recentUsers) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "user_registration");
            activity.put("description", "New user registered: " + user.getName());
            activity.put("timestamp", user.getId()); // Using ID as proxy for timestamp
            activity.put("userId", user.getId());
            activities.add(activity);
        }

        return activities;
    }
}
