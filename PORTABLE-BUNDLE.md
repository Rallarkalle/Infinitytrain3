# Alternative: Portable Node.js Bundle

If you cannot build the standalone .exe on another machine, here's an alternative approach that bundles a portable Node.js with your application.

## Approach: Portable Node.js + Application Files

Instead of compiling to a single .exe, you can:
1. Download a portable Node.js build
2. Bundle it with your application
3. Create a launcher script
4. Distribute the entire folder

This works WITHOUT installing Node.js system-wide.

## Steps to Create Portable Bundle

### 1. Download Portable Node.js

Download the Windows binary (.zip) from: https://nodejs.org/dist/latest-v20.x/

For Windows 64-bit, download something like:
`node-v20.x.x-win-x64.zip`

### 2. Extract to Project

Extract the zip to your project folder, rename to `node-portable`:
```
Infinitytrain2/
  ├── node-portable/
  │   ├── node.exe
  │   ├── npm
  │   └── ...
  ├── client/
  ├── server/
  └── ...
```

### 3. Install Dependencies Using Portable Node

Open PowerShell in the project folder:
```powershell
.\node-portable\node.exe .\node-portable\npm install
```

### 4. Build the Application

```powershell
# Build frontend
.\node-portable\node.exe .\node-portable\node_modules\vite\bin\vite.js build

# Build backend  
.\node-portable\node.exe .\node-portable\node_modules\esbuild\bin\esbuild server/index-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js
```

### 5. Create Launcher Script

Create `Start-InfinityTrain.bat`:
```batch
@echo off
echo Starting InfinityTrain...
echo.

REM Start the server using portable Node.js
start /B "" "node-portable\node.exe" "dist\index.js"

REM Wait for server to start
timeout /t 3 /nobreak > nul

REM Open browser
start http://localhost:5000

echo.
echo InfinityTrain is running!
echo Open your browser to: http://localhost:5000
echo.
echo Press Ctrl+C or close this window to stop.
echo.
pause
```

### 6. Distribution Package

Your distribution folder should contain:
```
InfinityTrain-Portable/
  ├── node-portable/        (Portable Node.js)
  ├── node_modules/         (Dependencies)
  ├── dist/                 (Built application)
  ├── training.db           (Will be created)
  └── Start-InfinityTrain.bat
```

## Advantages
- ✅ No compilation needed
- ✅ Works without system Node.js
- ✅ Easier to debug
- ✅ Can update files easily

## Disadvantages
- ❌ Larger file size (~150-200 MB)
- ❌ Multiple files instead of single .exe
- ❌ Slightly more complex to distribute

## Distribution

Compress the entire folder to a .zip file and share:
```powershell
Compress-Archive -Path InfinityTrain-Portable -DestinationPath InfinityTrain.zip
```

Users simply:
1. Extract the zip
2. Run `Start-InfinityTrain.bat`

## Updating

To update the application:
1. Replace files in `dist/` folder
2. No need to replace `node-portable/` or `node_modules/`
