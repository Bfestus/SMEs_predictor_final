"""
SME Success Predictor FastAPI Application
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import joblib
import pandas as pd
import numpy as np
import os
from datetime import datetime

app = FastAPI(
    title="SME Success Predictor API",
    description="Predict the success probability of Small and Medium Enterprises (SMEs) in Rwanda",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and mappings
trained_model = None
CATEGORICAL_MAPPINGS = None
PREDICTION_FEATURES = None

@app.on_event("startup")
async def startup_event():
    """Load model and initialize mappings on startup"""
    global trained_model, CATEGORICAL_MAPPINGS, PREDICTION_FEATURES
    
    # Define prediction features (order must match trained model)
    PREDICTION_FEATURES = [
        'business_capital',
        'owner_age',
        'education_level_numeric',
        'owner_business_experience',
        'capital_source',
        'business_sector',
        'number_of_employees',
        'business_location',
        'entity_type',
        'owner_gender'
    ]
    
    # Define categorical mappings
    CATEGORICAL_MAPPINGS = {
        'capital_source': {
            'Personal Savings': 0,
            'Bank Loan': 1,
            'Business Partner': 2,
            'Microfinance': 3,
            'Family/Friends': 4,
            'Government Grant': 5,
            'Foreign Investment': 6,
            'Venture Capital': 7,
            'Crowdfunding': 8,
            'Inheritance': 9
        },
        'business_sector': {
            'Agriculture, Forestry And Fishing': 0,
            'Information And Communication': 1,
            'Manufacturing': 2,
            'Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles': 3,
            'Professional, Scientific And Technical Activities': 4,
            'Human Health And Social Work Activities': 5,
            'Education': 6,
            'Accommodation And Food Service Activities': 7,
            'Administrative And Support Service Activities': 8,
            'Construction': 9,
            'Transportation And Storage': 10,
            'Financial And Insurance Activities': 11,
            'Arts, Entertainment And Recreation': 12,
            'Other Service Activities': 13,
            'Real Estate Activities': 14,
            'Public Administration And Defence; Compulsory Social Security': 15,
            'Water Supply, Gas And Remediation Services': 16,
            'Electricity, Gas And Air Conditioning Supply': 17,
            'Mining And Quarrying': 18,
            'Activities Of Households As Employers; Undifferentiated Goods- And Services-Producing Activities Of Households For Own Use': 19,
            'Activities Of Extraterritorial Organizations And Bodies': 20,
            'Unclassified': 21
        },
        'business_location': {
            'BUGESERA': 0, 'BURERA': 1, 'GAKENKE': 2, 'GASABO': 3, 'GATSIBO': 4,
            'GICUMBI': 5, 'GISAGARA': 6, 'HUYE': 7, 'KAMONYI': 8, 'KARONGI': 9,
            'KAYONZA': 10, 'KICUKIRO': 11, 'KIREHE': 12, 'MUHANGA': 13, 'MUSANZE': 14,
            'NGOMA': 15, 'NGORORERO': 16, 'NYABIHU': 17, 'NYAGATARE': 18, 'NYAMAGABE': 19,
            'NYAMASHEKE': 20, 'NYANZA': 21, 'NYARUGENGE': 22, 'NYARUGURU': 23, 'RUBAVU': 24,
            'RUHANGO': 25, 'RULINDO': 26, 'RUSIZI': 27, 'RUTSIRO': 28, 'RWAMAGANA': 29
        },
        'entity_type': {
            'INDIVIDUAL': 0,
            'PRIVATE CORPORATION': 1,
            'COOPERATIVE': 2,
            'JOINT VENTURE': 3
        },
        'owner_gender': {
            'M': 0,
            'F': 1
        }
    }
    
    # Load the trained model
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'sme_success_predictor_xgboost_20251031_075224.joblib')
        trained_model = joblib.load(model_path)
        print(f"✓ Model loaded successfully from {model_path}")
    except Exception as e:
        print(f"Error loading model: {e}")
        trained_model = None

# Pydantic models for request/response
class BusinessData(BaseModel):
    business_capital: float = Field(..., description="Business capital in Rwandan Francs (RWF)", example=1200000)
    owner_age: int = Field(..., description="Age of the business owner", example=30)
    owner_business_experience: int = Field(..., description="Years of business experience", example=7)
    capital_source: str = Field(..., description="Source of business capital", example="Personal Savings")
    business_sector: str = Field(..., description="Business sector/industry", example="Manufacturing")
    number_of_employees: int = Field(..., description="Number of employees", example=0)
    business_location: str = Field(..., description="Business location (district)", example="RULINDO")
    entity_type: str = Field(..., description="Type of business entity", example="COOPERATIVE")
    owner_gender: str = Field(..., description="Gender of business owner (M/F)", example="M")
    education_level_numeric: int = Field(..., description="Education level (0-4 scale)", example=0)

class PredictionResponse(BaseModel):
    success: bool
    prediction: Optional[int] = None
    prediction_label: Optional[str] = None
    success_probability: Optional[float] = None
    confidence_level: Optional[str] = None
    recommendations: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

def preprocess_business_data(data: Dict[str, Any]) -> pd.DataFrame:
    """Preprocess business data for prediction"""
    try:
        # Convert to DataFrame
        df = pd.DataFrame([data])
        
        # Validate all required features are present
        missing_features = [f for f in PREDICTION_FEATURES if f not in df.columns]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")
        
        # Encode categorical features
        for feature, mapping in CATEGORICAL_MAPPINGS.items():
            if feature in df.columns:
                # Handle unknown categories
                df[feature] = df[feature].map(mapping).fillna(-1)
        
        # Select and reorder features to match model training
        df = df[PREDICTION_FEATURES]
        
        return df
        
    except Exception as e:
        raise ValueError(f"Data preprocessing error: {str(e)}")

def generate_recommendations(business_data: Dict[str, Any], success_probability: float) -> Dict[str, Any]:
    """Generate business recommendations based on prediction"""
    recommendations = {
        "overall_assessment": "",
        "key_strengths": [],
        "improvement_areas": [],
        "action_items": [],
        "risk_level": ""
    }
    
    # Determine risk level
    if success_probability >= 0.7:
        recommendations["risk_level"] = "Low Risk"
        recommendations["overall_assessment"] = "Excellent business potential with high success probability."
    elif success_probability >= 0.5:
        recommendations["risk_level"] = "Medium Risk" 
        recommendations["overall_assessment"] = "Good business potential with moderate success probability."
    elif success_probability >= 0.3:
        recommendations["risk_level"] = "High Risk"
        recommendations["overall_assessment"] = "Business faces challenges but has potential for improvement."
    else:
        recommendations["risk_level"] = "Very High Risk"
        recommendations["overall_assessment"] = "Significant challenges identified. Consider major improvements."
    
    # Analyze specific factors
    capital_rwf = business_data.get('business_capital', 0)
    owner_age = business_data.get('owner_age', 0)
    experience = business_data.get('owner_business_experience', 0)
    employees = business_data.get('number_of_employees', 0)
    
    # Capital analysis
    if capital_rwf >= 2000000:  # 2M RWF
        recommendations["key_strengths"].append("Strong initial capital investment")
    elif capital_rwf < 500000:  # 500K RWF
        recommendations["improvement_areas"].append("Consider increasing initial capital")
        recommendations["action_items"].append("Explore additional funding sources or microfinance options")
    
    # Experience analysis
    if experience >= 10:
        recommendations["key_strengths"].append("Extensive business experience")
    elif experience < 3:
        recommendations["improvement_areas"].append("Limited business experience")
        recommendations["action_items"].append("Consider mentorship programs or business training")
    
    # Age analysis
    if 25 <= owner_age <= 45:
        recommendations["key_strengths"].append("Optimal age range for business leadership")
    elif owner_age < 25:
        recommendations["action_items"].append("Consider gaining additional experience or finding a mentor")
    
    # Employment analysis
    if employees >= 5:
        recommendations["key_strengths"].append("Good employment generation potential")
    elif employees == 0:
        recommendations["action_items"].append("Plan for gradual employment growth as business scales")
    
    # Sector-specific recommendations
    sector = business_data.get('business_sector', '')
    if 'Information And Communication' in sector:
        recommendations["action_items"].append("Focus on digital skills and technology adoption")
    elif 'Agriculture' in sector:
        recommendations["action_items"].append("Consider value-addition and modern farming techniques")
    elif 'Manufacturing' in sector:
        recommendations["action_items"].append("Focus on quality control and market distribution")
    
    return recommendations

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SME Success Predictor API",
        "version": "1.0.0",
        "status": "active" if trained_model is not None else "model_not_loaded"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": trained_model is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/categories")
async def get_categories():
    """Get all available categories for categorical features"""
    if CATEGORICAL_MAPPINGS is None:
        raise HTTPException(status_code=503, detail="Categorical mappings not loaded")
    
    return {
        "capital_sources": list(CATEGORICAL_MAPPINGS['capital_source'].keys()),
        "business_sectors": list(CATEGORICAL_MAPPINGS['business_sector'].keys()),
        "business_locations": list(CATEGORICAL_MAPPINGS['business_location'].keys()),
        "entity_types": list(CATEGORICAL_MAPPINGS['entity_type'].keys()),
        "genders": list(CATEGORICAL_MAPPINGS['owner_gender'].keys())
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_sme_success(business_data: BusinessData):
    """Make a prediction for SME success"""
    
    if trained_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert Pydantic model to dict
        data_dict = business_data.dict()
        
        # Preprocess the data
        processed_data = preprocess_business_data(data_dict)
        
        # Make prediction
        prediction = trained_model.predict(processed_data)[0]
        prediction_proba = trained_model.predict_proba(processed_data)[0]
        
        # Get success probability
        success_probability = prediction_proba[1]  # Probability of success (class 1)
        
        # Determine confidence level
        confidence = max(prediction_proba)
        if confidence >= 0.8:
            confidence_level = "High"
        elif confidence >= 0.6:
            confidence_level = "Medium"
        else:
            confidence_level = "Low"
        
        # Generate recommendations
        recommendations = generate_recommendations(data_dict, success_probability)
        
        return PredictionResponse(
            success=True,
            prediction=int(prediction),
            prediction_label="Successful" if prediction == 1 else "Unsuccessful",
            success_probability=round(success_probability, 4),
            confidence_level=confidence_level,
            recommendations=recommendations
        )
        
    except Exception as e:
        return PredictionResponse(
            success=False,
            error=str(e)
        )

@app.post("/batch-predict")
async def batch_predict(businesses: list[BusinessData]):
    """Make predictions for multiple businesses"""
    
    if trained_model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    if len(businesses) > 100:
        raise HTTPException(status_code=400, detail="Maximum 100 businesses per batch")
    
    results = []
    for i, business in enumerate(businesses):
        try:
            prediction_response = await predict_sme_success(business)
            results.append({
                "business_id": i + 1,
                "result": prediction_response
            })
        except Exception as e:
            results.append({
                "business_id": i + 1,
                "result": PredictionResponse(success=False, error=str(e))
            })
    
    return {"predictions": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)