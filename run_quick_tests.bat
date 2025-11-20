@echo off
REM SME Success Predictor - Quick Test Runner
REM Run only critical tests (API + Model validation) for quick feedback

echo ========================================
echo SME Success Predictor - Quick Tests
echo ========================================

echo.
echo Running critical tests only (API + Model)...
echo This will take about 2-3 minutes...
echo.

REM Install minimal dependencies
python -m pip install requests pandas numpy scikit-learn joblib --quiet

REM Run only critical tests
python tests\run_all_tests.py --skip-non-critical

if errorlevel 1 (
    echo.
    echo ========================================
    echo CRITICAL TESTS FAILED
    echo ========================================
) else (
    echo.
    echo ========================================
    echo CRITICAL TESTS PASSED!
    echo ========================================
)

echo.
echo Press any key to exit...
pause >nul