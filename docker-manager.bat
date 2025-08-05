@echo off
REM Metadata Editor Docker Management Script for Windows

if "%1"=="start" (
    echo 🚀 Starting Metadata Editor full stack...
    docker-compose up -d
    echo ✅ Services started successfully!
    echo 📊 Frontend: http://localhost:3000
    echo 🔌 Backend API: http://localhost:5000
    echo 🗄️  MongoDB: localhost:27017
) else if "%1"=="stop" (
    echo 🛑 Stopping Metadata Editor services...
    docker-compose down
    echo ✅ Services stopped successfully!
) else if "%1"=="restart" (
    echo 🔄 Restarting Metadata Editor services...
    docker-compose down
    docker-compose up -d
    echo ✅ Services restarted successfully!
) else if "%1"=="logs" (
    echo 📋 Showing logs for all services...
    docker-compose logs -f
) else if "%1"=="status" (
    echo 📈 Service status:
    docker-compose ps
) else if "%1"=="clean" (
    echo 🧹 Cleaning up containers and images...
    docker-compose down -v --remove-orphans
    docker-compose build --no-cache
    echo ✅ Cleanup completed!
) else if "%1"=="build" (
    echo 🔨 Building all services...
    docker-compose build
    echo ✅ Build completed!
) else (
    echo 🔧 Metadata Editor Docker Management
    echo.
    echo Usage: %0 {start^|stop^|restart^|logs^|status^|clean^|build}
    echo.
    echo Commands:
    echo   start   - Start all services
    echo   stop    - Stop all services
    echo   restart - Restart all services
    echo   logs    - Show logs from all services
    echo   status  - Show service status
    echo   clean   - Clean containers and rebuild
    echo   build   - Build all services
    echo.
)
