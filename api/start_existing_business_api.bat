@echo off
echo Starting Existing Business Predictor API...
echo API will be available at: http://localhost:8000
echo Frontend file: frontend_existing_business.html
echo.
echo Press Ctrl+C to stop the API
echo.
uvicorn main2:app --reload --port 8000 --host 0.0.0.0
pause