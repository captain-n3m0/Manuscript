package com.manupedia.repository;

import com.manupedia.entity.Manuscript;
import com.manupedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ManuscriptRepository extends JpaRepository<Manuscript, Long> {

    // Find manuscripts by user
    List<Manuscript> findByUploadedBy(User user);

    // Find manuscripts by user with pagination
    Page<Manuscript> findByUploadedBy(User user, Pageable pageable);

    // Search manuscripts by title
    @Query("SELECT m FROM Manuscript m WHERE LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Manuscript> findByTitleContainingIgnoreCase(@Param("title") String title);

    // Search manuscripts by author
    @Query("SELECT m FROM Manuscript m WHERE LOWER(m.author) LIKE LOWER(CONCAT('%', :author, '%'))")
    List<Manuscript> findByAuthorContainingIgnoreCase(@Param("author") String author);

    // Search manuscripts by language
    List<Manuscript> findByLanguageContainingIgnoreCase(String language);

    // Search manuscripts by condition
    List<Manuscript> findByCondition(String condition);

    // Find all manuscripts ordered by upload date (newest first)
    @Query("SELECT m FROM Manuscript m ORDER BY m.uploadDate DESC")
    List<Manuscript> findAllOrderByUploadDateDesc();

    // Find all manuscripts with pagination ordered by upload date
    @Query("SELECT m FROM Manuscript m ORDER BY m.uploadDate DESC")
    Page<Manuscript> findAllOrderByUploadDateDesc(Pageable pageable);

    // Complex search query
    @Query("SELECT m FROM Manuscript m WHERE " +
           "(:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:author IS NULL OR LOWER(m.author) LIKE LOWER(CONCAT('%', :author, '%'))) AND " +
           "(:language IS NULL OR LOWER(m.language) LIKE LOWER(CONCAT('%', :language, '%'))) AND " +
           "(:condition IS NULL OR m.condition = :condition)")
    Page<Manuscript> searchManuscripts(@Param("title") String title,
                                      @Param("author") String author,
                                      @Param("language") String language,
                                      @Param("condition") String condition,
                                      Pageable pageable);

    // Count manuscripts modified after a certain date
    long countByLastModifiedAfter(LocalDateTime date);

    // Find recent manuscripts with limit
    @Query(value = "SELECT * FROM manuscript ORDER BY upload_date DESC LIMIT :limit", nativeQuery = true)
    List<Manuscript> findTopByOrderByUploadDateDesc(@Param("limit") int limit);
}
