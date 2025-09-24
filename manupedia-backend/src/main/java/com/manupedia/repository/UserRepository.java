package com.manupedia.repository;

import com.manupedia.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Count users who have uploaded manuscripts
    @Query("SELECT COUNT(DISTINCT m.uploadedBy) FROM Manuscript m")
    long countUsersWithManuscripts();

    // Admin specific methods
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") String role);

    List<User> findTop10ByOrderByIdDesc();
}
