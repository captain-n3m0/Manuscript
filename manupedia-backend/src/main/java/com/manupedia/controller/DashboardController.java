package com.manupedia.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.manupedia.repository.ManualRepository;
import com.manupedia.repository.UserRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ManualRepository manualRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        
        // Get total manuscripts count
        long totalManuscripts = manualRepository.count();
        
        // Get recent updates (manuscripts updated in last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentUpdates = manualRepository.countByUpdatedAtAfter(thirtyDaysAgo);
        
        // Get total contributors count
        long contributors = userRepository.count();

        stats.put("totalManuscripts", totalManuscripts);
        stats.put("recentUpdates", recentUpdates);
        stats.put("contributors", contributors);

        return stats;
    }
}