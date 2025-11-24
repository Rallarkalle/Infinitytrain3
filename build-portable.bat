@echo off
REM This script helps create a portable bundle of InfinityTrain
REM It requires a pre-downloaded portable Node.js in the "node-portable" folder

echo ========================================
echo InfinityTrain Portable Bundle Creator
echo ========================================
echo.

REM Check if node-portable exists
if not exist "node-portable\node.exe" (
    echo ERROR: Portable Node.js not found!
    echo.
    echo Please download Node.js portable from:
    echo https://nodejs.org/dist/latest-v20.x/
    echo.
    echo Extract it to: node-portable\
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo Found portable Node.js
echo.

REM Install dependencies
echo Step 1: Installing dependencies...
echo This may take a few minutes...
echo.
"node-portable\node.exe" "node-portable\npm" install
if errorlevel 1 (
    echo Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Building frontend...
"node-portable\node.exe" "node_modules\vite\bin\vite.js" build
if errorlevel 1 (
    echo Failed to build frontend
    pause
    exit /b 1
)

echo.
echo Step 3: Building backend...
"node-portable\node.exe" "node_modules\esbuild\bin\esbuild" server\index-prod.ts --platform=node --packages=external --bundle --format=esm --outfile=dist\index.js
if errorlevel 1 (
    echo Failed to build backend
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Your portable application is ready!
echo.
echo To test it locally:
echo   1. Run: Start-InfinityTrain-Portable.bat
echo   2. Open browser to: http://localhost:5000
echo.
echo To distribute:
echo   1. Create a folder with these items:
echo      - node-portable/
echo      - node_modules/
echo      - dist/
echo      - Start-InfinityTrain-Portable.bat
echo   2. Compress to a .zip file
echo   3. Share the .zip file
echo.
echo Users just extract and run the .bat file!
echo ========================================
echo.
pause
