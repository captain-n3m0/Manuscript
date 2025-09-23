package com.manupedia.service;

import java.util.List;
import com.manupedia.dto.ManualUploadRequest;
import com.manupedia.entity.Manual;
import com.manupedia.entity.User;
import com.manupedia.repository.ManualRepository;
import com.manupedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ManualService {

    @Autowired
    private ManualRepository manualRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional(readOnly = true)
    public Manual getManualById(Long id) {
        return manualRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Manual not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Manual> getFeaturedManuscripts() {
        return manualRepository.findFeatured();
    }

    @Transactional
    public Manual toggleFeatureStatus(Long id) {
        Manual manual = getManualById(id);
        manual.setFeatured(!manual.isFeatured());
        return manualRepository.save(manual);
    }

    @Transactional
    public Manual uploadManual(ManualUploadRequest request, String userEmail) {
        User uploader = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Manual manual = new Manual();
        manual.setTitle(request.getTitle());
        manual.setAuthor(request.getAuthor());
        manual.setDateCreated(request.getDateCreated());
        manual.setOriginLocation(request.getOriginLocation());
        manual.setLanguage(request.getLanguage());
        manual.setMaterial(request.getMaterial());
        manual.setDimensions(request.getDimensions());
        manual.setCondition(request.getCondition());
        manual.setDescription(request.getDescription());
        manual.setContent(request.getContent());
        manual.setImageData(request.getImageData());
        manual.setImageType(request.getImageType());
        manual.setUploadedBy(uploader);

        return manualRepository.save(manual);
    }
}