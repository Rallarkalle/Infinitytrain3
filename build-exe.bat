@echo off
echo Building InfinityTrain Standalone Application...
echo.

REM Install dependencies if needed
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Build the application
echo.
echo Building frontend and backend...
call npm run build
if errorlevel 1 (
    echo Build failed
    pause
    exit /b 1
)

REM Create the exe using pkg
echo.
echo Creating standalone executable...
call npx pkg dist/index.js --targets node20-win-x64 --output InfinityTrain.exe
if errorlevel 1 (
    echo Failed to create executable
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build complete!
echo.
echo The standalone application has been created:
echo   - InfinityTrain.exe
echo.
echo To run the application, simply double-click InfinityTrain.exe
echo The database will be stored in: %%APPDATA%%\InfinityTrain\training.db
echo ========================================
echo.
pause
