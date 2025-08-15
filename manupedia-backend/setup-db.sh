#!/bin/bash

# MySQL Database Setup Script for Manupedia Backend

echo "Setting up MySQL database for Manupedia..."

# Check if MySQL is running
if ! pgrep -x "mysqld" > /dev/null; then
    echo "MySQL is not running. Please start MySQL first."
    echo "On macOS with Homebrew: brew services start mysql"
    exit 1
fi

# Create database and user
mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS manupedia_db;
CREATE USER IF NOT EXISTS 'manupedia_user'@'localhost' IDENTIFIED BY 'manupedia_password';
GRANT ALL PRIVILEGES ON manupedia_db.* TO 'manupedia_user'@'localhost';
FLUSH PRIVILEGES;

USE manupedia_db;

-- Show created database
SHOW DATABASES LIKE 'manupedia_db';
EOF

echo "Database setup completed!"
echo ""
echo "Database Details:"
echo "- Database Name: manupedia_db"
echo "- Username: manupedia_user (or use root)"
echo "- Password: manupedia_password (or your root password)"
echo ""
echo "Update your application.properties with the correct credentials."
