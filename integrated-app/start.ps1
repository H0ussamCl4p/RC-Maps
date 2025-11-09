Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ENSAM Event Management System" -ForegroundColor Yellow
Write-Host "  Starting Backend and Frontend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$frontendDir = Join-Path $scriptDir "frontend"

# Backend
Set-Location $backendDir
Write-Host "[1/4] Installing backend dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "[2/4] Starting backend server..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k npm start" -WorkingDirectory $backendDir

Start-Sleep -Seconds 3

# Frontend
Set-Location $frontendDir
Write-Host ""
Write-Host "[3/4] Installing frontend dependencies..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "[4/4] Starting frontend server..." -ForegroundColor Green
Start-Process cmd -ArgumentList "/k npm run dev" -WorkingDirectory $frontendDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers starting..." -ForegroundColor Yellow
Write-Host "  Backend: http://localhost:5000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
