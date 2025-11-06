"""
Existing Business Success Predictor API
FastAPI application for predicting success of existing SMEs using historical performance data
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from contextlib import asynccontextmanager
import joblib
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime
import shap

# Global variables for model components
xgb_model = None
feature_scaler = None
label_encoders = None
feature_names = None
model_metadata = None

# Model file paths (using the latest existing business model)
MODEL_VERSION = "20251106_133503"
MODEL_PATH = f"../models/existing_business_predictor_{MODEL_VERSION}.joblib"
SCALER_PATH = f"../models/feature_scaler_{MODEL_VERSION}.joblib"
ENCODERS_PATH = f"../models/label_encoders_{MODEL_VERSION}.joblib"
METADATA_PATH = f"../models/model_metadata_{MODEL_VERSION}.json"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model components on startup"""
    global xgb_model, feature_scaler, label_encoders, feature_names, model_metadata
    
    try:
        # Load XGBoost model
        if os.path.exists(MODEL_PATH):
            xgb_model = joblib.load(MODEL_PATH)
            print(f"✓ Loaded XGBoost model from {MODEL_PATH}")
        else:
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        
        # Load feature scaler
        if os.path.exists(SCALER_PATH):
            feature_scaler = joblib.load(SCALER_PATH)
            print(f"✓ Loaded feature scaler from {SCALER_PATH}")
        else:
            raise FileNotFoundError(f"Scaler file not found: {SCALER_PATH}")
        
        # Load label encoders
        if os.path.exists(ENCODERS_PATH):
            label_encoders = joblib.load(ENCODERS_PATH)
            print(f"✓ Loaded label encoders from {ENCODERS_PATH}")
        else:
            raise FileNotFoundError(f"Encoders file not found: {ENCODERS_PATH}")
        
        # Load metadata
        if os.path.exists(METADATA_PATH):
            with open(METADATA_PATH, 'r') as f:
                model_metadata = json.load(f)
            print(f"✓ Loaded model metadata from {METADATA_PATH}")
        else:
            print(f"Warning: Metadata file not found: {METADATA_PATH}")
        
        # Define feature names (must match training order)
        feature_names = [
            'turnover_first_year',
            'turnover_second_year',
            'turnover_third_year',
            'turnover_fourth_year',
            'employment_first_year',
            'employment_second_year',
            'employment_third_year',
            'employment_fourth_year',
            'revenue_per_employee_trend',
            'employment_efficiency',
            'business_capital',
            'number_of_employees',
            'business_sector_encoded',
            'business_scaling_encoded',
            'employment_growth_encoded'
        ]
        
        print("🚀 Existing Business Predictor API startup complete!")
        
    except Exception as e:
        print(f"❌ Error loading model components: {str(e)}")
        raise e
    
    yield
    
    # Cleanup on shutdown
    print("🔄 API shutting down...")

app = FastAPI(
    title="Existing Business Success Predictor API",
    description="Predict the continued success of existing SMEs in Rwanda using historical performance data",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model components
xgb_model = None
feature_scaler = None
label_encoders = None
feature_names = None
model_metadata = None

# Model file paths (using the latest existing business model)
MODEL_VERSION = "20251106_133503"
MODEL_PATH = f"../models/existing_business_predictor_{MODEL_VERSION}.joblib"
SCALER_PATH = f"../models/feature_scaler_{MODEL_VERSION}.joblib"
ENCODERS_PATH = f"../models/label_encoders_{MODEL_VERSION}.joblib"
METADATA_PATH = f"../models/model_metadata_{MODEL_VERSION}.json"

class ExistingBusinessData(BaseModel):
    """Input model for existing business prediction"""
    
    # Business Fundamentals
    business_capital: float = Field(
        default=25000000, 
        description="Business capital amount in RWF", 
        gt=0,
        example=25000000
    )
    business_sector: str = Field(
        default="Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles",
        description="Business sector category",
        example="Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles"
    )
    entity_type: str = Field(
        default="PRIVATE CORPORATION",
        description="Business entity type",
        example="PRIVATE CORPORATION"
    )
    business_location: str = Field(
        default="GASABO",
        description="Business location (Rwanda district)",
        example="GASABO"
    )
    number_of_employees: int = Field(
        default=15,
        description="Current number of employees", 
        ge=0,
        example=15
    )
    capital_source: str = Field(
        default="Bank Loan",
        description="Primary source of capital",
        example="Bank Loan"
    )
    
    # Historical Performance - Revenue (4 years)
    turnover_first_year: float = Field(
        default=12000000,
        description="Revenue in 1st year of operation (RWF)", 
        ge=0,
        example=12000000
    )
    turnover_second_year: float = Field(
        default=18000000,
        description="Revenue in 2nd year (RWF)", 
        ge=0,
        example=18000000
    )
    turnover_third_year: float = Field(
        default=24000000,
        description="Revenue in 3rd year (RWF)", 
        ge=0,
        example=24000000
    )
    turnover_fourth_year: float = Field(
        default=30000000,
        description="Revenue in 4th year (RWF)", 
        ge=0,
        example=30000000
    )
    
    # Historical Performance - Employment (4 years)
    employment_first_year: int = Field(
        default=5,
        description="Number of employees in 1st year", 
        ge=0,
        example=5
    )
    employment_second_year: int = Field(
        default=8,
        description="Number of employees in 2nd year", 
        ge=0,
        example=8
    )
    employment_third_year: int = Field(
        default=12,
        description="Number of employees in 3rd year", 
        ge=0,
        example=12
    )
    employment_fourth_year: int = Field(
        default=15,
        description="Number of employees in 4th year", 
        ge=0,
        example=15
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "business_capital": 25000000,
                "business_sector": "Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles",
                "entity_type": "PRIVATE CORPORATION",
                "business_location": "GASABO",
                "number_of_employees": 15,
                "capital_source": "Bank Loan",
                "turnover_first_year": 12000000,
                "turnover_second_year": 18000000,
                "turnover_third_year": 24000000,
                "turnover_fourth_year": 30000000,
                "employment_first_year": 5,
                "employment_second_year": 8,
                "employment_third_year": 12,
                "employment_fourth_year": 15
            }
        }

class PredictionResponse(BaseModel):
    """Response model for business prediction"""
    success: bool = Field(description="Whether the business is predicted to succeed (True) or fail (False)")
    prediction: str = Field(description="Human-readable prediction result: 'Success' or 'Failure'")
    success_probability: float = Field(description="Probability of success (0.0 to 1.0). Values above 0.5 indicate likely success")
    confidence: float = Field(description="Model confidence in the prediction (0.0 to 1.0). Higher values indicate more certainty")
    business_insights: Dict[str, Any] = Field(description="Key business metrics and performance indicators")
    recommendations: List[str] = Field(description="Actionable business recommendations based on the analysis")
    risk_factors: List[str] = Field(description="Identified potential risks that could impact business success")
    model_version: str = Field(description="Version of the machine learning model used for prediction")
    timestamp: str = Field(description="ISO timestamp when the prediction was made")
    
    model_config = {
        "protected_namespaces": (),
        "json_schema_extra": {
            "example": {
                "success": True,
                "prediction": "Success",
                "success_probability": 0.8745,
                "confidence": 0.8745,
                "business_insights": {
                    "revenue_growth_rate": 25.5,
                    "employment_growth": "Increased",
                    "business_scaling": "High_Scaling", 
                    "employment_efficiency": 1.23,
                    "revenue_consistency": 0.856,
                    "current_revenue_per_employee": 2000000,
                    "capital_efficiency": 1.2
                },
                "recommendations": [
                    "Continue current growth strategy - performance indicators are strong",
                    "Consider expanding to new markets to accelerate growth",
                    "Maintain current employment growth pace for sustainable scaling"
                ],
                "risk_factors": [],
                "model_version": "20251106_133503",
                "timestamp": "2025-11-06T15:30:45.123456"
            }
        }
    }

class BusinessInsightsResponse(BaseModel):
    """Response model for detailed business insights"""
    financial_health: Dict[str, Any] = Field(description="Financial performance analysis including revenue trends and capital utilization")
    growth_analysis: Dict[str, Any] = Field(description="Growth metrics including CAGR, sustainability assessment, and scaling readiness")
    employment_trends: Dict[str, Any] = Field(description="Employment and productivity analysis including efficiency trends")
    scaling_indicators: Dict[str, Any] = Field(description="Business scaling assessment and operational efficiency indicators")
    benchmark_comparison: Dict[str, Any] = Field(description="Performance comparison against industry peers and size categories")
    recommendations: List[str] = Field(description="Detailed strategic recommendations for business improvement")
    
    model_config = {
        "protected_namespaces": (),
        "json_schema_extra": {
            "example": {
                "financial_health": {
                    "revenue_trend": "Growing",
                    "revenue_growth_rate": 25.5,
                    "revenue_stability": "High",
                    "capital_utilization": 120.0,
                    "average_annual_revenue": 21000000
                },
                "growth_analysis": {
                    "revenue_cagr": 25.74,
                    "employment_growth_pattern": "Increased",
                    "scaling_assessment": "High_Scaling",
                    "growth_sustainability": "High"
                },
                "employment_trends": {
                    "productivity_trend": "Improving",
                    "efficiency_score": 1.234,
                    "current_productivity": 2000000,
                    "employment_stability": "Increased"
                },
                "scaling_indicators": {
                    "scaling_stage": "High_Scaling",
                    "operational_efficiency": "High",
                    "growth_readiness": "Ready"
                },
                "benchmark_comparison": {
                    "sector": "Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles",
                    "performance_vs_peers": "Above Average",
                    "size_category": "Medium"
                },
                "recommendations": [
                    "Continue current growth strategy - performance indicators are strong",
                    "Consider expanding to new markets to accelerate growth",
                    "Maintain current employment growth pace for sustainable scaling"
                ]
            }
        }
    }

def engineer_features(data: ExistingBusinessData) -> Dict[str, float]:
    """Engineer features from input data"""
    
    # Calculate revenue growth rate
    first_year = data.turnover_first_year
    third_year = data.turnover_third_year
    
    if first_year == 0:
        revenue_growth_rate = 300 if third_year > 0 else 0
    else:
        revenue_growth_rate = ((third_year - first_year) / first_year) * 100
    
    # Calculate revenue consistency score
    revenues = [data.turnover_first_year, data.turnover_second_year, data.turnover_third_year]
    revenue_std = np.std(revenues)
    revenue_mean = np.mean(revenues)
    revenue_consistency_score = 1 / (1 + (revenue_std / (revenue_mean + 1)))
    
    # Calculate employment efficiency and trends
    emp_current = data.employment_third_year
    emp_initial = data.employment_first_year
    revenue_per_employee_current = third_year / (emp_current + 1)
    revenue_per_employee_initial = first_year / (emp_initial + 1)
    revenue_per_employee_trend = revenue_per_employee_current - revenue_per_employee_initial
    employment_efficiency = revenue_per_employee_current / (revenue_per_employee_initial + 1)
    
    # Determine employment growth pattern
    emp_fourth = data.employment_fourth_year
    emp_third = data.employment_third_year
    
    if emp_fourth > emp_third:
        employment_growth = 'Increased'
    elif emp_fourth == emp_third:
        employment_growth = 'Stable'
    else:
        employment_growth = 'Decreased'
    
    # Calculate business scaling indicator
    employment_growth_map = {'Increased': 1, 'Stable': 0, 'Decreased': -1}
    employment_score = employment_growth_map.get(employment_growth, 0)
    
    if revenue_growth_rate > 10 and employment_score >= 0:
        business_scaling_indicator = 'High_Scaling'
    elif revenue_growth_rate > 0 and employment_score >= 0:
        business_scaling_indicator = 'Moderate_Scaling'
    elif revenue_growth_rate <= 0 and employment_score < 0:
        business_scaling_indicator = 'Declining'
    else:
        business_scaling_indicator = 'Mixed_Performance'
    
    return {
        'revenue_growth_rate': revenue_growth_rate,
        'revenue_consistency_score': revenue_consistency_score,
        'revenue_per_employee_trend': revenue_per_employee_trend,
        'employment_efficiency': employment_efficiency,
        'employment_growth': employment_growth,
        'business_scaling_indicator': business_scaling_indicator
    }

def encode_categorical_features(data: ExistingBusinessData, engineered: Dict) -> Dict[str, int]:
    """Encode categorical features using saved encoders"""
    
    encoded = {}
    
    # Encode business sector
    try:
        encoded['business_sector_encoded'] = label_encoders['business_sector'].transform([data.business_sector])[0]
    except:
        encoded['business_sector_encoded'] = 0  # Default for unknown categories
    
    # Encode entity type
    try:
        encoded['entity_type_encoded'] = label_encoders['entity_type'].transform([data.entity_type])[0]
    except:
        encoded['entity_type_encoded'] = 0
    
    # Encode business scaling indicator
    try:
        encoded['business_scaling_indicator_encoded'] = label_encoders['business_scaling_indicator'].transform([engineered['business_scaling_indicator']])[0]
    except:
        encoded['business_scaling_indicator_encoded'] = 0
    
    return encoded

def generate_recommendations(data: ExistingBusinessData, engineered: Dict, prediction_prob: float, input_features: np.ndarray) -> List[str]:
    """Generate SHAP-based business recommendations"""
    
    try:
        # Create SHAP explainer for the model
        explainer = shap.TreeExplainer(xgb_model)
        
        # Calculate SHAP values for this specific prediction
        shap_values = explainer.shap_values(input_features.reshape(1, -1))
        
        # Get feature impacts with names
        feature_impacts = list(zip(feature_names, shap_values[0]))
        
        # Sort by absolute impact (most influential features first)
        top_features = sorted(feature_impacts, key=lambda x: abs(x[1]), reverse=True)[:5]
        
        recommendations = []
        
        # Generate recommendations based on SHAP insights
        for i, (feature, impact) in enumerate(top_features, 1):
            feature_name = feature.replace('_', ' ').title()
            
            if impact < -0.1:  # Strong negative impact
                recommendations.append(f"{i}. Improve {feature_name}: This factor is significantly reducing your success probability (Impact: {impact:.3f})")
            elif impact < 0:  # Mild negative impact
                recommendations.append(f"{i}. Address {feature_name}: Minor negative influence on success - consider optimization (Impact: {impact:.3f})")
            elif impact > 0.1:  # Strong positive impact
                recommendations.append(f"{i}. Leverage {feature_name}: Strong positive driver - maintain and enhance this strength (Impact: +{impact:.3f})")
            else:  # Mild positive impact
                recommendations.append(f"{i}. Optimize {feature_name}: Positive contributor - opportunities for further improvement (Impact: +{impact:.3f})")
        
        return recommendations
        
    except Exception as e:
        # Fallback to basic recommendations if SHAP fails
        return [
            "1. Monitor revenue trends and implement growth strategies",
            "2. Optimize employment efficiency and productivity",
            "3. Strengthen financial management practices", 
            "4. Focus on business scaling indicators",
            "5. Enhance market positioning and competitiveness"
        ]

def identify_risk_factors(data: ExistingBusinessData, engineered: Dict) -> List[str]:
    """Identify potential risk factors"""
    
    risks = []
    
    # Revenue decline risk
    if engineered['revenue_growth_rate'] < -10:
        risks.append("Significant revenue decline detected")
    
    # Employment instability risk
    if engineered['employment_growth'] == 'Decreased':
        risks.append("Declining employment trend indicates operational challenges")
    
    # Low efficiency risk
    if engineered['employment_efficiency'] < 0.8:
        risks.append("Below-average employee productivity")
    
    # Small scale risk
    if data.number_of_employees < 5:
        risks.append("Small team size may limit growth capacity")
    
    # Capital constraint risk
    if data.business_capital < 5000000:  # Less than 5M RWF
        risks.append("Limited capital may constrain business operations")
    
    return risks

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Existing Business Success Predictor API",
        "version": "2.0.0",
        "model_version": MODEL_VERSION,
        "model_accuracy": "93.5%",
        "model_auc": "95.8%",
        "status": "operational",
        "endpoints": {
            "predict": "/predict-existing-business",
            "insights": "/business-insights", 
            "health": "/health",
            "docs": "/docs"
        },
        "sample_input_values": {
            "business_sectors": [
                "Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles",
                "Other Service Activities",
                "Transportation And Storage", 
                "Financial And Insurance Activities",
                "Accommodation And Food Service Activities",
                "Manufacturing",
                "Construction"
            ],
            "entity_types": [
                "INDIVIDUAL",
                "PRIVATE CORPORATION", 
                "COOPERATIVE",
                "JOINT VENTURE",
                "LIMITED LIABILITY COMPANY",
                "PARTNERSHIP",
                "SOLE PROPRIETORSHIP"
            ],
            "business_locations": [
                "GASABO", "NYARUGENGE", "KICUKIRO", "HUYE", "RUBAVU",
                "MUHANGA", "NYANZA", "RWAMAGANA", "NGOMA", "KAYONZA"
            ],
            "capital_sources": [
                "Personal Savings", "Bank Loan", "Family/Friends",
                "Government Grant", "Microfinance", "Business Partner",
                "Foreign Investment", "Venture Capital", "Crowdfunding"
            ]
        },
        "usage_guide": {
            "step_1": "Use /predict-existing-business for success prediction",
            "step_2": "Use /business-insights for detailed analysis", 
            "step_3": "Provide 4-year historical data for accurate predictions",
            "tip": "Visit /docs for interactive API testing"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    model_loaded = xgb_model is not None
    scaler_loaded = feature_scaler is not None
    encoders_loaded = label_encoders is not None
    
    return {
        "status": "healthy" if all([model_loaded, scaler_loaded, encoders_loaded]) else "unhealthy",
        "model_loaded": model_loaded,
        "scaler_loaded": scaler_loaded,
        "encoders_loaded": encoders_loaded,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/predict-existing-business", 
          response_model=PredictionResponse,
          summary="Predict Business Success",
          description="""
          Predict the continued success of an existing SME using historical performance data.
          
          **Input Requirements:**
          - Business fundamentals (capital, sector, location, etc.)
          - 4-year historical revenue data (turnover_first_year to turnover_fourth_year)
          - 4-year historical employment data (employment_first_year to employment_fourth_year)
          
          **Model Performance:**
          - Accuracy: 93.5%
          - AUC Score: 95.8%
          - Algorithm: XGBoost Classifier
          
          **Response Includes:**
          - Success prediction with confidence score
          - Calculated business metrics (growth rates, efficiency scores)
          - Tailored recommendations for business improvement
          - Risk factor identification
          
          **Sample Business Scenario:**
          The default example shows a growing retail business in Gasabo district with:
          - 150% revenue growth over 4 years (12M to 30M RWF)
          - 200% employment growth (5 to 15 employees)  
          - 25M RWF initial capital from bank loan
          - Expected prediction: Success with high confidence
          """)
async def predict_existing_business(data: ExistingBusinessData):
    """
    Predict the continued success of an existing business
    """
    
    if xgb_model is None or feature_scaler is None or label_encoders is None:
        raise HTTPException(status_code=500, detail="Model components not loaded")
    
    try:
        # Step 1: Engineer features
        engineered = engineer_features(data)
        
        # Step 2: Encode categorical features
        encoded = encode_categorical_features(data, engineered)
        
        # Step 3: Create feature vector
        feature_vector = np.array([
            data.turnover_first_year,
            data.turnover_second_year,
            data.turnover_third_year,
            data.turnover_fourth_year,
            data.employment_first_year,
            data.employment_second_year,
            data.employment_third_year,
            data.employment_fourth_year,
            engineered['revenue_per_employee_trend'],
            engineered['employment_efficiency'],
            data.business_capital,
            data.number_of_employees,
            encoded['business_sector_encoded'],
            encoded['entity_type_encoded'],
            encoded['business_scaling_indicator_encoded']
        ]).reshape(1, -1)
        
        # Step 4: Scale features
        feature_vector_scaled = feature_scaler.transform(feature_vector)
        
        # Step 5: Make prediction
        prediction = xgb_model.predict(feature_vector_scaled)[0]
        probabilities = xgb_model.predict_proba(feature_vector_scaled)[0]
        
        success_probability = probabilities[1]
        confidence = max(probabilities[0], probabilities[1])
        prediction_label = "Success" if prediction == 1 else "Failure"
        
        # Step 6: Generate insights and recommendations
        recommendations = generate_recommendations(data, engineered, success_probability, feature_vector_scaled)
        risk_factors = identify_risk_factors(data, engineered)
        
        # Step 7: Prepare business insights
        business_insights = {
            "revenue_growth_rate": round(engineered['revenue_growth_rate'], 2),
            "employment_growth": engineered['employment_growth'],
            "business_scaling": engineered['business_scaling_indicator'],
            "employment_efficiency": round(engineered['employment_efficiency'], 3),
            "revenue_consistency": round(engineered['revenue_consistency_score'], 3),
            "current_revenue_per_employee": round(data.turnover_fourth_year / (data.employment_fourth_year + 1), 0),
            "capital_efficiency": round(data.turnover_fourth_year / data.business_capital, 3)
        }
        
        return PredictionResponse(
            success=prediction == 1,
            prediction=prediction_label,
            success_probability=round(success_probability, 4),
            confidence=round(confidence, 4),
            business_insights=business_insights,
            recommendations=recommendations,
            risk_factors=risk_factors,
            model_version=MODEL_VERSION,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

@app.post("/business-insights", 
          response_model=BusinessInsightsResponse,
          summary="Get Detailed Business Analysis",
          description="""
          Get comprehensive business insights and performance analysis for an existing SME.
          
          **Analysis Includes:**
          - **Financial Health:** Revenue trends, capital utilization, stability assessment
          - **Growth Analysis:** CAGR calculation, sustainability metrics, scaling readiness
          - **Employment Trends:** Productivity analysis, efficiency scoring, workforce stability
          - **Scaling Indicators:** Operational efficiency, growth stage assessment
          - **Benchmark Comparison:** Performance vs industry peers and size category
          - **Strategic Recommendations:** Actionable advice for business improvement
          
          **Use Cases:**
          - Business performance review
          - Strategic planning support
          - Investment decision analysis
          - Operational improvement identification
          
          **Metrics Explained:**
          - Revenue CAGR: Compound Annual Growth Rate over 4 years
          - Employment Efficiency: Revenue per employee improvement ratio
          - Capital Utilization: Revenue generation per RWF of capital (as percentage)
          - Scaling Assessment: Business growth stage and operational efficiency
          """)
async def get_business_insights(data: ExistingBusinessData):
    """
    Get detailed business insights and analysis
    """
    
    try:
        # Engineer features for analysis
        engineered = engineer_features(data)
        
        # Financial health analysis
        financial_health = {
            "revenue_trend": "Growing" if engineered['revenue_growth_rate'] > 0 else "Declining",
            "revenue_growth_rate": round(engineered['revenue_growth_rate'], 2),
            "revenue_stability": "High" if engineered['revenue_consistency_score'] > 0.8 else "Moderate" if engineered['revenue_consistency_score'] > 0.6 else "Low",
            "capital_utilization": round(data.turnover_fourth_year / data.business_capital * 100, 2),
            "average_annual_revenue": round(np.mean([data.turnover_first_year, data.turnover_second_year, data.turnover_third_year, data.turnover_fourth_year]), 0)
        }
        
        # Growth analysis
        growth_analysis = {
            "revenue_cagr": round(((data.turnover_fourth_year / data.turnover_first_year) ** (1/3) - 1) * 100 if data.turnover_first_year > 0 else 0, 2),
            "employment_growth_pattern": engineered['employment_growth'],
            "scaling_assessment": engineered['business_scaling_indicator'],
            "growth_sustainability": "High" if engineered['revenue_growth_rate'] > 15 and engineered['employment_growth'] == 'Increased' else "Moderate"
        }
        
        # Employment trends
        employment_trends = {
            "productivity_trend": "Improving" if engineered['employment_efficiency'] > 1 else "Declining",
            "efficiency_score": round(engineered['employment_efficiency'], 3),
            "current_productivity": round(data.turnover_fourth_year / (data.employment_fourth_year + 1), 0),
            "employment_stability": engineered['employment_growth']
        }
        
        # Scaling indicators
        scaling_indicators = {
            "scaling_stage": engineered['business_scaling_indicator'],
            "operational_efficiency": "High" if engineered['employment_efficiency'] > 1.2 else "Moderate",
            "growth_readiness": "Ready" if engineered['revenue_growth_rate'] > 10 and data.business_capital > 10000000 else "Preparation Needed"
        }
        
        # Benchmark comparison (simplified)
        benchmark_comparison = {
            "sector": data.business_sector,
            "performance_vs_peers": "Above Average" if engineered['revenue_growth_rate'] > 10 else "Average" if engineered['revenue_growth_rate'] > 0 else "Below Average",
            "size_category": "Large" if data.number_of_employees > 50 else "Medium" if data.number_of_employees > 10 else "Small"
        }
        
        # Generate comprehensive recommendations (create dummy features for insights endpoint)
        dummy_features = np.array([
            data.turnover_first_year, data.turnover_second_year, data.turnover_third_year, data.turnover_fourth_year,
            data.employment_first_year, data.employment_second_year, data.employment_third_year, data.employment_fourth_year,
            engineered['revenue_per_employee_trend'], engineered['employment_efficiency'], data.business_capital,
            data.number_of_employees, 1, 1, 1  # dummy encoded values
        ])
        recommendations = generate_recommendations(data, engineered, 0.8, dummy_features)
        
        return BusinessInsightsResponse(
            financial_health=financial_health,
            growth_analysis=growth_analysis,
            employment_trends=employment_trends,
            scaling_indicators=scaling_indicators,
            benchmark_comparison=benchmark_comparison,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Analysis error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)