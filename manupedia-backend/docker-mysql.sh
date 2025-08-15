#!/bin/bash

# Docker MySQL Setup for Manupedia

echo "Starting MySQL with Docker..."

# Stop and remove existing container if it exists
docker stop manupedia-mysql 2>/dev/null
docker rm manupedia-mysql 2>/dev/null

# Start MySQL container
docker run -d \
  --name manupedia-mysql \
  -e MYSQL_ROOT_PASSWORD='Nem0@#$003' \
  -e MYSQL_DATABASE=manupedia \
  -p 3306:3306 \
  mysql:8.0

echo "Waiting for MySQL to start..."
sleep 30

echo "MySQL is running on localhost:3306"
echo "Database: manupedia"
echo "Username: root"
echo "Password: Nem0@#$003"
