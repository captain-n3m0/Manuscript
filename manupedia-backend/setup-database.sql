-- Manupedia Database Setup Script
-- Run this script to set up the complete database structure

-- Create the database
CREATE DATABASE IF NOT EXISTS manupedia;

-- Use the database
USE manupedia;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'USER',
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

-- Create manuals table
CREATE TABLE IF NOT EXISTS manuals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    file_url VARCHAR(500),
    uploaded_by BIGINT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    manual_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    FOREIGN KEY (manual_id) REFERENCES manuals(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert sample admin user (password: "admin123")
INSERT INTO users (name, email, password, role, created_at, updated_at) VALUES
('Admin User', 'admin@manupedia.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1VosSC3PATJoYjPHZmKJD.BKSuHJyNW', 'ADMIN', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- Show tables and structure
SHOW TABLES;
SELECT 'Database setup completed successfully!' as Status;
