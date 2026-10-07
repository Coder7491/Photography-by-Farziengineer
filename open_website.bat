@echo off
title Photography by Farzi Engineer - Luxury Wedding Studio
echo ========================================================
echo    PHOTOGRAPHY BY FARZI ENGINEER - LUXURY WEDDING STUDIO
echo ========================================================
echo.

:: Check if server is responding on port 8080
powershell -NoProfile -Command "try { $r = (Invoke-WebRequest -Uri 'http://localhost:8080/' -TimeoutSec 1 -UseBasicParsing).StatusCode; if ($r -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting local web server in background...
    start /min powershell -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%~dp0server.ps1"
    timeout /t 2 /nobreak >nul
)

echo Opening website in your default browser...
start "" "http://localhost:8080/"
echo.
echo Website is LIVE at http://localhost:8080/
echo Contact: +91 7491800797
echo Email: farziengineer1.0@gmail.com
echo.
timeout /t 3 >nul
