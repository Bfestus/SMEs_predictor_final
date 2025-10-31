@echo off
echo Starting SME Success Predictor API...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher and try again
    pause
    exit /b 1
)

REM Check if we're in the right directory
if not exist "main.py" (
    echo Error: main.py not found
    echo Please run this script from the api directory
    pause
    exit /b 1
)

REM Check if requirements are installed
python -c "import fastapi, uvicorn" >nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo Error: Failed to install requirements
        pause
        exit /b 1
    )
)

REM Check if model file exists
if not exist "../models/sme_success_predictor_xgboost_20251031_075224.joblib" (
    echo Warning: Model file not found at ../models/sme_success_predictor_xgboost_20251031_075224.joblib
    echo The API will start but predictions will fail until the model is available
    echo.
)

echo ✓ Python is available
echo ✓ Dependencies are installed
echo ✓ Starting FastAPI server...
echo.
echo API will be available at:
echo   • Main API: http://localhost:8000
echo   • Documentation: http://localhost:8000/docs
echo   • Test Frontend: Open frontend.html in your browser
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the API server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000