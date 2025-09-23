DROP DATABASE IF EXISTS manupedia_db;
CREATE DATABASE manupedia_db;
USE manupedia_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create manuals table
CREATE TABLE IF NOT EXISTS manuals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    date_created VARCHAR(100),
    origin_location VARCHAR(255),
    language VARCHAR(100),
    material VARCHAR(255),
    dimensions VARCHAR(100),
    manuscript_condition VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    description TEXT,
    content TEXT,
    image_data LONGBLOB,
    image_type VARCHAR(50),
    uploaded_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_manual_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    manual_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_manual FOREIGN KEY (manual_id) REFERENCES manuals(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert initial admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@manupedia.com', '$2a$10$6UVHQoHhPoKfgm0Z5QQHau.IfHm5y0LuL1nLAuSg9FZQoEopv.QJi', 'ADMIN');