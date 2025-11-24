@echo off
REM InfinityTrain Launcher Script
echo.
echo ========================================
echo   InfinityTrain Learning Tracker
echo ========================================
echo.
echo Starting server...
echo.

REM Start the application in the background
start /B "" "InfinityTrain.exe"

REM Wait a moment for the server to start
timeout /t 3 /nobreak > nul

REM Open the default browser
echo Opening browser...
start http://localhost:5000

echo.
echo Application is running!
echo.
echo Your training data is stored in:
echo %APPDATA%\InfinityTrain\training.db
echo.
echo To stop the application, close this window.
echo.
pause
