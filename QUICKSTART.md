# 🚀 SME Success Predictor - Complete Setup Guide

## Project Overview

Complete AI-powered SME Success Predictor with FastAPI backend and React frontend.

```
SMEs_predictor_final/
├── api/                     # FastAPI Backend
│   ├── main.py             # API server
│   ├── frontend.html       # Simple HTML test interface
│   ├── test_api.py         # API testing script
│   └── start_api.bat       # API startup script
├── frontend/               # React Frontend
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies
│   └── start_frontend.bat  # Frontend startup script
├── models/                 # Trained ML models
├── notebooks/              # Jupyter notebook with model training
└── data/                   # Training dataset
```

## 🎯 Quick Start (3 Steps)

### Step 1: Start the API Backend
```bash
cd api
start_api.bat
```
**API will be available at:** http://localhost:8000

### Step 2: Start the React Frontend
```bash
cd frontend
start_frontend.bat
```
**Frontend will be available at:** http://localhost:3000

### Step 3: Test the Application
1. Open http://localhost:3000 in your browser
2. Navigate to the Predictor page
3. Fill out the business form
4. Get instant AI predictions!

## 📊 What You Get

### 🔮 AI Predictor
- **10 Business Features**: Capital, age, experience, sector, location, etc.
- **85% Accuracy**: Trained on 10,000+ Rwandan SME records
- **Instant Results**: Real-time predictions with explanations
- **Smart Recommendations**: Actionable business advice

### 🌐 Professional Website
- **Landing Page**: Hero section, features, testimonials
- **About Page**: Company story, team, technology
- **Services Page**: Offerings, pricing, industry expertise
- **Predictor Page**: Full prediction interface
- **Contact Page**: Contact form, FAQ, team info

### ⚡ Technical Features
- **FastAPI Backend**: High-performance Python API
- **React Frontend**: Modern, responsive web application
- **Machine Learning**: XGBoost model with feature importance
- **API Documentation**: Auto-generated at `/docs`

## 🛠️ Manual Setup (If Scripts Don't Work)

### Backend Setup
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## 📱 Using the Application

### Web Interface
1. **Homepage**: Learn about the service
2. **Predictor**: Enter business details and get predictions
3. **About**: Understand the technology and team
4. **Services**: Explore available offerings
5. **Contact**: Get in touch for support

### API Usage
```python
import requests

# Make a prediction
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

## 🔧 Configuration

### API Configuration
- **Model Path**: Automatically loads from `../models/`
- **CORS**: Configured for frontend integration
- **Port**: Default 8000 (configurable)

### Frontend Configuration
- **API URL**: `http://localhost:8000` (configurable)
- **Port**: Default 3000
- **Build**: Production-ready build available

## 📈 Features Summary

### Business Intelligence
- ✅ Success probability prediction
- ✅ Risk level assessment
- ✅ Confidence scoring
- ✅ Personalized recommendations
- ✅ Sector-specific insights

### User Experience
- ✅ Professional design
- ✅ Mobile responsive
- ✅ Real-time predictions
- ✅ Error handling
- ✅ Loading states

### Technical
- ✅ RESTful API
- ✅ Interactive documentation
- ✅ Batch processing
- ✅ Data validation
- ✅ Security measures

## 🚀 Deployment Ready

### Production Checklist
- [ ] Update API URLs for production
- [ ] Configure CORS for your domain
- [ ] Set up HTTPS certificates
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Deploy to cloud platform

### Recommended Stack
- **API**: AWS/Azure + Docker
- **Frontend**: Netlify/Vercel
- **Database**: PostgreSQL (for user data)
- **Monitoring**: Sentry + Google Analytics

## 📞 Support

### Troubleshooting
1. **API Won't Start**: Check Python installation and model file
2. **Frontend Won't Start**: Check Node.js installation
3. **Predictions Fail**: Ensure API is running and accessible
4. **CORS Errors**: Check API CORS configuration

### Getting Help
- Check the README files in each directory
- Review the API documentation at `/docs`
- Test with the provided sample data
- Verify all dependencies are installed

## 🎉 You're All Set!

Your complete SME Success Predictor is now ready to use! 

- **API Documentation**: http://localhost:8000/docs
- **Web Application**: http://localhost:3000
- **Simple Test Interface**: Open `api/frontend.html`

Happy predicting! 🔮📊🚀