# InfinityTrain - Complete Setup Guide

## Overview

InfinityTrain has been upgraded with:
1. ✅ **SQLite Database** - All user inputs are now persistently stored
2. ✅ **Standalone Distribution Options** - Can run without installing Node.js

## What User Data Is Stored

The application now saves ALL user inputs automatically:

### 1. Training Modules (Topics)
- Module title
- Icon selection
- Created/modified timestamps
- Archive/restore state

### 2. Subtopics
- Subtopic title
- Resource content (full Markdown text)
- Associated with parent module

### 3. User Progress Tracking
- Per user, per subtopic status
- Four levels: Not Addressed, Basic, Good, Fully Understood
- Automatically saved when changed

### 4. Comments & Notes
- Text comments
- Image URLs
- Drawing data
- User who created it
- Timestamp

### 5. User Information
- User profiles (name, email, role, avatar)
- Login credentials (for demo purposes)

## Database Location

Data is stored in SQLite database at:
- **Windows**: `C:\Users\[Username]\AppData\Roaming\InfinityTrain\training.db`
- **Alternative**: Next to the executable if APPDATA is not available

## Distribution Methods

You have THREE options to run this application without installing Node.js:

---

### Option 1: Standalone .exe (RECOMMENDED)
**Best for**: Single-file distribution, easiest for end users

**Requirements**: Must be built on a machine with Node.js

**Instructions**: See `BUILD-INSTRUCTIONS.md`

**Steps**:
1. On a machine with Node.js, run `build-exe.bat`
2. Get the resulting `InfinityTrain.exe` file (50-70 MB)
3. Copy to any Windows PC
4. Double-click to run

**Pros**:
- ✅ Single file
- ✅ Smallest distribution size
- ✅ Most professional

**Cons**:
- ❌ Requires build machine with Node.js
- ❌ Native modules need compilation

---

### Option 2: Portable Bundle
**Best for**: When you can't build .exe, need easier debugging

**Requirements**: Download portable Node.js once

**Instructions**: See `PORTABLE-BUNDLE.md`

**Steps**:
1. Download Node.js portable (zip) from nodejs.org
2. Extract to `node-portable` folder
3. Run `build-portable.bat`
4. Distribute the entire folder (150-200 MB)
5. Users run `Start-InfinityTrain-Portable.bat`

**Pros**:
- ✅ No compilation needed
- ✅ Easier to update
- ✅ Works on any Windows PC

**Cons**:
- ❌ Larger size
- ❌ Multiple files to distribute

---

### Option 3: Normal Development Setup
**Best for**: Developers, machines where Node.js can be installed

**Requirements**: Node.js installed

**Steps**:
```powershell
npm install
npm run build
npm start
```

**Access**: http://localhost:5000

---

## Quick Start Comparison

| Method | Size | Files | Build Required | Node.js on Target |
|--------|------|-------|----------------|-------------------|
| Standalone .exe | 50-70 MB | 1-2 files | ✅ Yes (once) | ❌ No |
| Portable Bundle | 150-200 MB | Folder | ✅ Yes (simple) | ❌ No (bundled) |
| Dev Setup | N/A | Source | ⚠️ Every time | ✅ Yes |

## Files Overview

### For Users (Runtime)
- `InfinityTrain.exe` - Standalone executable (Option 1)
- `InfinityTrain-Launcher.bat` - Auto-opens browser
- `Start-InfinityTrain-Portable.bat` - Portable launcher (Option 2)
- `training.db` - Your data (auto-created)

### For Developers (Build)
- `build-exe.bat` - Builds standalone .exe
- `build-portable.bat` - Builds portable bundle
- `BUILD-INSTRUCTIONS.md` - How to build .exe
- `PORTABLE-BUNDLE.md` - How to create portable bundle
- `README-STANDALONE.md` - Standalone .exe documentation

### Source Code
- `client/` - React frontend
- `server/` - Express backend
  - `sqlite-storage.ts` - **NEW** SQLite database implementation
  - `storage.ts` - Old in-memory storage (replaced)
  - `routes.ts` - API endpoints
- `package.json` - Updated dependencies

## Changes Made

### 1. Database Implementation
- ✅ Created `server/sqlite-storage.ts` with full SQLite implementation
- ✅ All CRUD operations for topics, subtopics, comments, progress
- ✅ Automatic schema creation on first run
- ✅ Sample data loaded on fresh install

### 2. Dependency Updates
- ✅ Added `better-sqlite3` for SQLite support
- ✅ Added `pkg` for standalone .exe building
- ✅ Removed unnecessary dependencies:
  - ❌ `drizzle-orm` (replaced with direct SQLite)
  - ❌ `drizzle-kit` (no longer needed)
  - ❌ `@neondatabase/serverless` (no longer needed)
  - ❌ `connect-pg-simple` (no longer needed)
  - ❌ `passport-local` (simplified auth)

### 3. Code Cleanup
- ✅ Removed `framer-motion` dependency (replaced with CSS transitions)
- ✅ Updated `infinity-grid.tsx` to use plain divs instead of motion.div
- ✅ Removed unused Drizzle schema files
- ✅ Removed PostgreSQL configuration

### 4. Build Configuration
- ✅ Added `build:exe` script to package.json
- ✅ Created `build-exe.bat` for automated building
- ✅ Created `build-portable.bat` for portable version
- ✅ Updated production server to handle bundled static files

## Testing Checklist

Before distributing, test these features:

### Data Persistence
- [ ] Create a new training module → Close app → Reopen → Module still there
- [ ] Add a subtopic → Close app → Reopen → Subtopic still there
- [ ] Update progress status → Close app → Reopen → Status preserved
- [ ] Add a comment → Close app → Reopen → Comment still there
- [ ] Edit resource content → Close app → Reopen → Changes saved

### Functionality
- [ ] All modules display correctly
- [ ] Clicking module opens topic view
- [ ] Progress indicators update
- [ ] Comments can be added
- [ ] Resources can be edited
- [ ] Admin features work (add/edit/archive modules)

### Standalone Features (if using .exe)
- [ ] Runs without Node.js installed
- [ ] Opens browser automatically (with launcher)
- [ ] Database created in AppData folder
- [ ] Can be copied to USB and runs on another PC

## Current Status

✅ **COMPLETED**:
1. SQLite database implementation
2. All user inputs persistently stored
3. Build scripts for standalone distribution
4. Removed unnecessary dependencies
5. Code cleanup (framer-motion removed)
6. Documentation created

⚠️ **NEXT STEPS** (requires Node.js on build machine):
1. Install dependencies: `npm install`
2. Build the application (choose one option):
   - For .exe: Run `build-exe.bat`
   - For portable: Run `build-portable.bat`
3. Test the built application
4. Distribute to target PCs

## Support & Troubleshooting

### Common Issues

**"Database is locked"**
- Close all instances of the application
- Check if training.db is open in another program

**"Port 5000 already in use"**
- Close other applications using port 5000
- Or set PORT environment variable to different port

**"Can't find static files"**
- Ensure `client/dist` exists after build
- Check console for file path errors

**Build fails with native module errors**
- Windows: Install Visual Studio Build Tools
- Ensure Python is installed
- Run `npm install --global windows-build-tools`

## Security Notes

- Application runs on localhost only
- No external network access
- Data stored locally on user's machine
- Simple user system (for demo/training purposes)
- For production use, implement proper authentication

## License

Check the LICENSE file in the repository.

---

## Summary for Non-Technical Users

**What this means for you:**
1. All your work is automatically saved
2. You can close and reopen the app without losing anything
3. The app can be shared to other PCs easily
4. No internet connection needed
5. No complicated setup required

**To use:**
1. Get the `InfinityTrain.exe` file (or portable bundle)
2. Double-click to run
3. It will open in your browser automatically
4. Start training!

Everything you create, edit, or track is automatically saved to your computer.
