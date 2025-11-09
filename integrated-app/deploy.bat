@echo off
echo ==========================================
echo   ENSAM Event - Vercel Deployment
echo ==========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [X] Vercel CLI is not installed
    echo [*] Installing Vercel CLI...
    npm install -g vercel
)

echo [OK] Vercel CLI is ready
echo.

REM Check if user is logged in
echo [*] Checking Vercel authentication...
vercel whoami
if %errorlevel% neq 0 (
    echo [*] Please login to Vercel...
    vercel login
)

echo.
echo [*] Building project...
echo.

REM Install dependencies
echo [1/2] Installing frontend dependencies...
cd frontend
call npm install

echo [2/2] Installing backend dependencies...
cd ..\backend
call npm install

cd ..

echo.
echo [*] Deploying to Vercel...
echo.

REM Deploy
vercel --prod

echo.
echo ==========================================
echo   Deployment Complete!
echo ==========================================
echo.
echo WARNING: Don't forget to:
echo   1. Set up your environment variables in Vercel Dashboard
echo   2. Configure your database
echo   3. Update CORS settings
echo.
pause
