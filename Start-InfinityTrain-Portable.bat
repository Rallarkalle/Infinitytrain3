@echo off
REM InfinityTrain Portable Launcher
echo.
echo ========================================
echo   InfinityTrain Learning Tracker
echo   (Portable Edition)
echo ========================================
echo.

REM Check if node-portable exists
if not exist "node-portable\node.exe" (
    echo ERROR: Portable Node.js not found!
    echo Please ensure node-portable folder exists.
    pause
    exit /b 1
)

REM Check if built application exists
if not exist "dist\index.js" (
    echo ERROR: Application not built!
    echo Please run build-portable.bat first.
    pause
    exit /b 1
)

echo Starting server...
echo.

REM Set environment variable for production
set NODE_ENV=production
set PORT=5000

REM Start the application in the background
start /B "" "node-portable\node.exe" "dist\index.js"

REM Wait a moment for the server to start
timeout /t 3 /nobreak > nul

REM Open the default browser
echo Opening browser...
start http://localhost:5000

echo.
echo Application is running!
echo.
echo Your training data is stored in:
if defined APPDATA (
    echo %APPDATA%\InfinityTrain\training.db
) else (
    echo .\training.db
)
echo.
echo To stop the application, close this window or press Ctrl+C.
echo.
pause
