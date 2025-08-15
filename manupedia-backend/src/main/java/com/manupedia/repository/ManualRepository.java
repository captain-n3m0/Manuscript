package com.manupedia.repository;

import com.manupedia.entity.Manual;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ManualRepository extends JpaRepository<Manual, Long> {

    Page<Manual> findByCategory(Manual.Category category, Pageable pageable);

    Page<Manual> findByBrandContainingIgnoreCase(String brand, Pageable pageable);

    Page<Manual> findByModelContainingIgnoreCase(String model, Pageable pageable);

    @Query("SELECT m FROM Manual m WHERE " +
           "LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.model) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Manual> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    List<Manual> findTop10ByOrderByDownloadCountDesc();

    List<Manual> findTop10ByOrderByCreatedAtDesc();
}
