#!/bin/bash

# Employee Training Platform Launcher for macOS/Linux

echo ""
echo "========================================"
echo "Employee Training Platform Launcher"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo ""
    echo "Please install Node.js from https://nodejs.org/"
    echo ""
    exit 1
fi

# Get Node.js version
NODE_VERSION=$(node --version)
echo "Found Node.js $NODE_VERSION"
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not available"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies... This may take a few minutes."
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
    echo ""
fi

# Launch the application
echo "Starting Employee Training Platform..."
echo "Application will open at: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try to open in browser (works on macOS and some Linux distros)
if command -v open &> /dev/null; then
    open http://localhost:5000
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5000
fi

sleep 2
npm run dev
