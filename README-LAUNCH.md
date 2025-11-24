# Employee Training Platform - Local Setup Guide

This guide will help you run the Employee Training Platform on your local machine.

## Prerequisites

**Node.js (v18 or higher)** is required to run this application.

### Download Node.js
- Visit https://nodejs.org/
- Download the LTS (Long-Term Support) version
- Run the installer and follow the prompts
- **Important**: Check the box that says "Add to PATH" during installation

## Running the Application

### For Windows Users

**Option 1: Using the Launcher (Easiest)**
1. Double-click `Launch-App.bat` in the project folder
2. The launcher will automatically:
   - Check if Node.js is installed
   - Install dependencies (if needed)
   - Start the application
   - Open your browser to http://localhost:5000

**Option 2: Manual Command Line**
1. Open Command Prompt or PowerShell
2. Navigate to the project folder
3. Run these commands:
   ```
   npm install
   npm run dev
   ```
4. Open your browser and go to http://localhost:5000

### For macOS/Linux Users

**Option 1: Using the Launcher (Easiest)**
1. Open Terminal
2. Navigate to the project folder
3. Run: `bash Launch-App.sh`
4. The launcher will automatically:
   - Check if Node.js is installed
   - Install dependencies (if needed)
   - Start the application
   - Open your browser to http://localhost:5000

**Option 2: Manual Command Line**
1. Open Terminal
2. Navigate to the project folder
3. Run these commands:
   ```
   npm install
   npm run dev
   ```
4. Open your browser and go to http://localhost:5000

## Features

- **16 Training Modules** with responsive grid layout
- **Role-Based Access**: Admin and Employee roles
- **Progress Tracking**: 4-level progress system (Not Addressed, Basic, Good, Fully Understood)
- **Advanced Notepad** with drawing capabilities (arrows, markers, squares with 6 colors)
- **Zoom Control**: 50% - 200% zoom with mouse scroll
- **Image Support**: Draggable images in notepads
- **Cross-Device Sync**: All changes automatically sync via backend API
- **Ocean Infinity Branding**: Custom blue (#49A7FF) and green (#48BF91) colors

## Troubleshooting

### "Node.js is not installed"
- Make sure Node.js is installed from https://nodejs.org/
- After installation, restart your terminal/command prompt
- Run `node --version` to verify installation

### "Port 5000 is already in use"
- Another application is using port 5000
- Change the PORT environment variable: `set PORT=3000` (Windows) or `export PORT=3000` (Mac/Linux)
- Then run `npm run dev` again

### Slow initial startup
- First launch may take longer as dependencies are installed
- Subsequent launches will be faster

### Browser doesn't open automatically
- Manually open your browser and go to http://localhost:5000
- If that doesn't work, try http://127.0.0.1:5000

## Support

For more information or issues, please contact the development team.

---
**Employee Training Platform** - Built for Ocean Infinity
