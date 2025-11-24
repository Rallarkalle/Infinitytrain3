@echo off
REM Employee Training Platform Launcher for Windows

echo.
echo ========================================
echo Employee Training Platform Launcher
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo Make sure to add Node.js to your system PATH during installation
    echo.
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Found Node.js %NODE_VERSION%
echo.

REM Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies... This may take a few minutes.
    echo.
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Launch the application
echo Starting Employee Training Platform...
echo Application will open at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.
start http://localhost:5000
timeout /t 2 /nobreak
call npm run dev

pause
