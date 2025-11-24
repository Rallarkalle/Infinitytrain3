# InfinityTrain - Standalone Build Instructions

## Building the Standalone Executable

### Prerequisites
- Node.js and npm must be installed on the build machine (but NOT on target machines)
- Windows 10/11

### Build Steps

1. **Install Dependencies** (First time only)
   ```bash
   npm install
   ```

2. **Build the Standalone Executable**
   
   Simply run the build script:
   ```bash
   build-exe.bat
   ```
   
   This will:
   - Install dependencies if needed
   - Build the frontend (React/Vite)
   - Build the backend (Express/TypeScript)
   - Bundle everything with Node.js runtime into `InfinityTrain.exe`

### What Gets Built

- `InfinityTrain.exe` - Standalone executable with Node.js runtime embedded
- No external dependencies required on target machines
- Database stored in user's AppData folder

## Running the Application

### Option 1: Direct Launch (Recommended)
1. Double-click `InfinityTrain-Launcher.bat`
2. The application will start and automatically open in your default browser
3. Access at: http://localhost:5000

### Option 2: Manual Launch
1. Double-click `InfinityTrain.exe`
2. Wait a few seconds for the server to start
3. Open your browser to: http://localhost:5000

## Data Storage

All user data is automatically saved to:
```
C:\Users\YourUsername\AppData\Roaming\InfinityTrain\training.db
```

This includes:
- Training modules (topics)
- Subtopics and resources
- User progress tracking
- Comments and notes
- Images and drawings

## Distributing to Other PCs

To share the application:

1. **Copy these files:**
   - `InfinityTrain.exe` (the main executable)
   - `InfinityTrain-Launcher.bat` (optional, for easy launching)

2. **Send to users** via:
   - Network share
   - USB drive
   - Email (if size permits)
   - Cloud storage (OneDrive, Google Drive, etc.)

3. **Users just need to:**
   - Copy the file(s) to their computer
   - Run `InfinityTrain.exe` or `InfinityTrain-Launcher.bat`
   - NO NODE.JS INSTALLATION REQUIRED!

## Features

- **Persistent Storage**: SQLite database ensures all data is saved
- **Portable**: Runs on any Windows PC without Node.js
- **User-Friendly**: Simple double-click to start
- **Multi-User**: Each Windows user has their own database
- **Offline**: Works completely offline, no internet required

## Troubleshooting

### Application Won't Start
- Check if port 5000 is already in use
- Try closing the application and restarting
- Look for error messages in the console

### Database Issues
- Database location: `%APPDATA%\InfinityTrain\training.db`
- To reset: Delete the database file (data will be lost!)
- Fresh install will recreate default data

### Can't Access in Browser
- Ensure you're accessing http://localhost:5000
- Try 127.0.0.1:5000 instead
- Check Windows Firewall settings

## Technical Details

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: SQLite (better-sqlite3)
- **Bundler**: pkg (bundles Node.js runtime)
- **UI Components**: Radix UI + Tailwind CSS

## User Inputs That Are Persisted

1. **Training Modules/Topics**
   - Module title
   - Icon selection
   - Archive/restore state

2. **Subtopics**
   - Subtopic title
   - Resource content (Markdown)

3. **Progress Tracking**
   - Per user, per subtopic
   - Status: Not Addressed, Basic, Good, Fully Understood

4. **Comments/Notes**
   - Text comments
   - Image uploads
   - Drawing annotations
   - Timestamps

## Building for Different Platforms

Currently configured for Windows 64-bit. To build for other platforms, modify the build command in `build-exe.bat`:

- **Windows 32-bit**: `--targets node20-win-x86`
- **macOS**: `--targets node20-macos-x64`
- **Linux**: `--targets node20-linux-x64`

## Security Notes

- Application runs locally only (localhost)
- No external network access required
- Data stored locally on user's machine
- Simple user authentication (demo purposes)

## Maintenance

### Updating the Application
1. Rebuild with new changes: `build-exe.bat`
2. Replace the old `InfinityTrain.exe` with the new one
3. User data is preserved (stored separately)

### Database Migrations
- Current version auto-creates schema on first run
- Future updates may require migration scripts
- Always backup the database before major updates

## Support

For issues or questions, check:
- Console output for error messages
- Database file existence and permissions
- Windows Event Viewer for system-level issues
