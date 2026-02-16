@echo off
REM Docker Quick Start Script for Portfolio Application (Windows)

echo 🐳 Starting Portfolio Application with Docker...

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo 📝 Creating .env from .env.docker.example...
    copy .env.docker.example .env
    echo.
    echo ⚠️  Please edit .env file with your actual credentials before continuing!
    echo Required variables:
    echo   - GITHUB_USERNAME
    echo   - CLICKUP_API_KEY
    echo   - MAILGUN_API_KEY
    echo   - MAILGUN_DOMAIN
    echo.
    pause
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Build and start services
echo 🏗️  Building Docker images...
docker-compose build

echo 🚀 Starting services...
docker-compose up -d

echo.
echo ✅ Services started successfully!
echo.
echo 📍 Access points:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo    Health:   http://localhost:3001/api/health
echo.
echo 📊 View logs:
echo    docker-compose logs -f
echo.
echo 🛑 Stop services:
echo    docker-compose down
echo.
pause
