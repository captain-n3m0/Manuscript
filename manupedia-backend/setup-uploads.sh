#!/bin/bash

# Create uploads directory structure for manuscript storage
echo "Setting up manuscript upload directories..."

# Get user home directory
HOME_DIR="$HOME"
UPLOAD_DIR="$HOME_DIR/manupedia/uploads/manuscripts"

# Create directories if they don't exist
mkdir -p "$UPLOAD_DIR"

# Set appropriate permissions
chmod 755 "$HOME_DIR/manupedia"
chmod 755 "$HOME_DIR/manupedia/uploads"
chmod 755 "$UPLOAD_DIR"

echo "Upload directories created successfully:"
echo "  Base directory: $HOME_DIR/manupedia/uploads"
echo "  Manuscripts directory: $UPLOAD_DIR"
echo ""
echo "Directory structure:"
ls -la "$HOME_DIR/manupedia/uploads/"

echo ""
echo "Setup complete! The backend is now ready to store manuscript files."
