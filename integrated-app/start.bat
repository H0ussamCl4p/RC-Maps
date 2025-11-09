@echo off
echo ========================================
echo   ENSAM Event Management System
echo   Starting Backend and Frontend...
echo ========================================

cd /d "%~dp0backend"
echo.
echo [1/4] Installing backend dependencies...
call npm install

echo.
echo [2/4] Starting backend server...
start "Backend Server" cmd /k "npm start"

timeout /t 3 /nobreak >nul

cd /d "%~dp0frontend"
echo.
echo [3/4] Installing frontend dependencies...
call npm install

echo.
echo [4/4] Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers starting...
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
