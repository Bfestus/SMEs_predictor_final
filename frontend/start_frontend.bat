@echo off
echo Starting SME Success Predictor Frontend...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ and try again
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: package.json not found
    echo Please run this script from the frontend directory
    pause
    exit /b 1
)

echo ✓ Node.js is available
echo.

REM Check if node_modules exists, if not install dependencies
if not exist "node_modules" (
    echo Installing dependencies...
    echo This may take a few minutes...
    npm install
    if errorlevel 1 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed successfully
    echo.
)

echo ✓ Dependencies are available
echo.

REM Check if API is running
echo Checking if API is running...
curl -s http://localhost:8000/health >nul 2>&1
if errorlevel 1 (
    echo Warning: API server not detected at http://localhost:8000
    echo Please make sure the FastAPI backend is running
    echo You can still run the frontend, but predictions won't work
    echo.
)

echo Starting React development server...
echo.
echo Frontend will be available at:
echo   • Main Site: http://localhost:3000
echo   • All pages accessible via navigation
echo.
echo Backend API should be at:
echo   • API Server: http://localhost:8000
echo   • API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the development server
echo.

REM Start the React development server
npm start