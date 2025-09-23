package com.manupedia.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.manupedia.entity.Manual;
import com.manupedia.repository.ManualRepository;
import com.manupedia.service.ManualService;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ManualRepository manualRepository;

    @Autowired
    private ManualService manualService;

    @GetMapping("/manuscripts")
    public Page<Manual> getManuscripts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        
        if (status != null && !status.isEmpty() && search != null && !search.isEmpty()) {
            return manualRepository.findByStatusAndTitleContainingIgnoreCase(
                Manual.Status.valueOf(status), search, pageRequest);
        } else if (status != null && !status.isEmpty()) {
            return manualRepository.findByStatus(Manual.Status.valueOf(status), pageRequest);
        } else if (search != null && !search.isEmpty()) {
            return manualRepository.findByTitleContainingIgnoreCase(search, pageRequest);
        }
        
        return manualRepository.findAll(pageRequest);
    }

    @PatchMapping("/manuscripts/{id}/status")
    public ResponseEntity<?> updateManuscriptStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate
    ) {
        Manual manuscript = manualRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Manuscript not found"));
        
        manuscript.setStatus(Manual.Status.valueOf(statusUpdate.get("status")));
        manualRepository.save(manuscript);
        
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/manuscripts/{id}")
    public ResponseEntity<?> deleteManuscript(@PathVariable Long id) {
        manualRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}