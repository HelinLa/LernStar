@echo off
title LernStar – App starten
echo.
echo  ==========================================
echo   LernStar wird gestartet ...
echo  ==========================================
echo.

cd /d "%~dp0"

REM Prüfe ob Python vorhanden ist
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo  Server läuft auf: http://localhost:8787
    echo  Bitte dieses Fenster OFFEN lassen.
    echo.
    start "" "http://localhost:8787"
    python -m http.server 8787
    goto end
)

REM Fallback: Python3
python3 --version >nul 2>&1
if %errorlevel% == 0 (
    echo  Server läuft auf: http://localhost:8787
    echo  Bitte dieses Fenster OFFEN lassen.
    echo.
    start "" "http://localhost:8787"
    python3 -m http.server 8787
    goto end
)

REM Fallback: Node.js http-server
npx http-server -p 8787 -o >nul 2>&1
if %errorlevel% == 0 goto end

REM Kein Server gefunden – direkt öffnen (kein PWA-Install möglich)
echo  HINWEIS: Python nicht gefunden.
echo  Öffne Datei direkt (ohne App-Installation) ...
echo.
start "" "%~dp0index.html"

:end
