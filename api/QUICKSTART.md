# 🚀 Quick Start Guide - SME Success Predictor API

## Step 1: Start the API Server

### Option A: Using the Startup Script (Recommended)
1. Open Command Prompt
2. Navigate to the api folder:
   ```cmd
   cd "c:\Users\thinkBIG\Desktop\SMEs_predictor_final\api"
   ```
3. Run the startup script:
   ```cmd
   start_api.bat
   ```

### Option B: Manual Start
1. Install dependencies:
   ```cmd
   pip install -r requirements.txt
   ```
2. Start the server:
   ```cmd
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

## Step 2: Test the API

### Method 1: Web Interface (Easiest)
1. Open `frontend.html` in your web browser
2. Fill out the business information form
3. Click "Predict Business Success"
4. View results and recommendations

### Method 2: API Documentation
1. Open http://localhost:8000/docs in your browser
2. Try the `/predict` endpoint with sample data
3. View response format and test different scenarios

### Method 3: Test Script
1. Run the automated test:
   ```cmd
   python test_api.py
   ```

## Step 3: Sample API Usage

### Using curl:
```bash
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
       "business_capital": 1500000,
       "owner_age": 35,
       "owner_business_experience": 10,
       "capital_source": "Bank Loan",
       "business_sector": "Information And Communication",
       "number_of_employees": 3,
       "business_location": "GASABO",
       "entity_type": "PRIVATE CORPORATION",
       "owner_gender": "F",
       "education_level_numeric": 3
     }'
```

### Using Python:
```python
import requests

response = requests.post("http://localhost:8000/predict", json={
    "business_capital": 1500000,
    "owner_age": 35,
    "owner_business_experience": 10,
    "capital_source": "Bank Loan",
    "business_sector": "Information And Communication",
    "number_of_employees": 3,
    "business_location": "GASABO",
    "entity_type": "PRIVATE CORPORATION",
    "owner_gender": "F",
    "education_level_numeric": 3
})

result = response.json()
print(f"Success Probability: {result['success_probability']:.1%}")
```

## 🔗 Important URLs

- **API Server**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health
- **Categories**: http://localhost:8000/categories

## 📊 Expected Response Format

```json
{
  "success": true,
  "prediction": 1,
  "prediction_label": "Successful",
  "success_probability": 0.7543,
  "confidence_level": "High",
  "recommendations": {
    "overall_assessment": "Excellent business potential with high success probability.",
    "key_strengths": ["Strong initial capital investment", "Extensive business experience"],
    "improvement_areas": [],
    "action_items": ["Focus on digital skills and technology adoption"],
    "risk_level": "Low Risk"
  }
}
```

## 🛠️ Troubleshooting

### API Won't Start
- Check that Python 3.8+ is installed
- Ensure you're in the correct directory
- Verify dependencies are installed: `pip install -r requirements.txt`

### Model Loading Error
- Confirm model file exists at: `../models/sme_success_predictor_xgboost_20251031_075224.joblib`
- Check file permissions

### Prediction Errors
- Verify all required fields are provided
- Check categorical values against valid options
- Ensure numeric fields are proper integers/floats

### Frontend Not Working
- Confirm API server is running on port 8000
- Check browser console for CORS errors
- Verify frontend.html is opened in a modern browser

## 🎯 Ready for Production?

1. **Update CORS settings** in `main.py` for your domain
2. **Use production WSGI server**: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker`
3. **Set up reverse proxy** (nginx) for HTTPS
4. **Configure environment variables** for sensitive settings
5. **Set up monitoring** and logging
6. **Regular model updates** with new training data

## 📞 Need Help?

- Check the full README.md for detailed documentation
- Review test_api.py for usage examples
- API documentation available at /docs endpoint
- Model training code in ../notebooks/sme_analysis.ipynb