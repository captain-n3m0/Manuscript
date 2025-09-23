package com.manupedia.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.manupedia.entity.Manual;

@Repository
public interface ManualRepository extends JpaRepository<Manual, Long> {

    long countByUpdatedAtAfter(LocalDateTime date);

    @Query("SELECT m FROM Manual m WHERE " +
           "LOWER(m.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.author) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.content) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Manual> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    List<Manual> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT m FROM Manual m WHERE m.imageData IS NOT NULL")
    Page<Manual> findAllWithImages(Pageable pageable);

    @Query("SELECT m FROM Manual m WHERE m.featured = true AND m.status = 'APPROVED'")
    List<Manual> findFeatured();

    @Query("SELECT m FROM Manual m WHERE m.featured = true AND m.status = 'APPROVED'")
    Page<Manual> findFeaturedPaged(Pageable pageable);

    Page<Manual> findByStatus(Manual.Status status, Pageable pageable);
    
    @Query("SELECT m FROM Manual m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Manual> findByTitleContainingIgnoreCase(@Param("search") String search, Pageable pageable);
    
    @Query("SELECT m FROM Manual m WHERE m.status = :status AND LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Manual> findByStatusAndTitleContainingIgnoreCase(
        @Param("status") Manual.Status status, @Param("search") String search, Pageable pageable);
}
