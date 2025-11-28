"""
SME Success Predictor FastAPI Application
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import joblib
import pandas as pd
import numpy as np
import os
import json
from datetime import datetime
import shap

# Prediction tracking file path
PREDICTIONS_LOG_FILE = "predictions_log.json"
FEEDBACK_LOG_FILE = "feedback_log.json"

def log_prediction(prediction_type: str, input_data: dict, prediction_result: dict):
    """Log prediction to JSON file for admin tracking"""
    try:
        # Load existing logs
        if os.path.exists(PREDICTIONS_LOG_FILE):
            with open(PREDICTIONS_LOG_FILE, 'r') as f:
                logs = json.load(f)
        else:
            logs = []
        
        # Create new log entry
        log_entry = {
            "id": len(logs) + 1,
            "timestamp": datetime.now().isoformat(),
            "prediction_type": prediction_type,  # "new_business" or "existing_business"
            "input_data": input_data,
            "prediction_result": prediction_result
        }
        
        # Append and save
        logs.append(log_entry)
        with open(PREDICTIONS_LOG_FILE, 'w') as f:
            json.dump(logs, f, indent=2)
    except Exception as e:
        print(f"Error logging prediction: {e}")

app = FastAPI(
    title="Combined SME Success Predictor API",
    description="""
    Comprehensive SME Success Prediction Platform for Rwanda
    
    This API provides predictions for both:
    
    **New Business Prediction** - For startups and new business ventures
    - Uses business fundamentals and owner characteristics
    - Provides success probability and recommendations
    
    **Existing Business Prediction** - For established businesses with historical data  
    - Uses 4-year performance history
    - Provides SHAP-based explanations and recommendations
    - Advanced business insights and risk assessment
    """,
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for NEW BUSINESS model and mappings
trained_model = None
CATEGORICAL_MAPPINGS = None
PREDICTION_FEATURES = None

# Global variables for EXISTING BUSINESS model components
xgb_model = None
feature_scaler = None
label_encoders = None
feature_names = None
model_metadata = None

# Model file paths for existing business
MODEL_VERSION = "20251106_133503"
EXISTING_MODEL_PATH = f"../models/existing_business_predictor_{MODEL_VERSION}.joblib"
EXISTING_SCALER_PATH = f"../models/feature_scaler_{MODEL_VERSION}.joblib"
EXISTING_ENCODERS_PATH = f"../models/label_encoders_{MODEL_VERSION}.joblib"
EXISTING_METADATA_PATH = f"../models/model_metadata_{MODEL_VERSION}.json"

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
            'Inheritance': 9,
            'Business Incubator': 10,
            'Angel Investment': 11
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
            'Unclassified': 21,
            'Motorcycle transport': 22,
            'Activities of Mobile Money Agents': 23
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
            'JOINT VENTURE': 3,
            'LIMITED LIABILITY COMPANY': 4,
            'PARTNERSHIP': 5,
            'SOLE PROPRIETORSHIP': 6
        },
        'owner_gender': {
            'M': 0,
            'F': 1
        }
    }
    
    # Load the trained model
    try:
        model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'sme_success_predictor_random_forest_20251105_124414.joblib')
        trained_model = joblib.load(model_path)
        print(f"✓ New business model loaded successfully from {model_path}")
    except Exception as e:
        print(f"Error loading new business model: {e}")
        trained_model = None
    
    # === LOAD EXISTING BUSINESS MODEL COMPONENTS ===
    global xgb_model, feature_scaler, label_encoders, feature_names, model_metadata
    
    try:
        # Load XGBoost model
        if os.path.exists(EXISTING_MODEL_PATH):
            xgb_model = joblib.load(EXISTING_MODEL_PATH)
            print(f"✓ Existing business XGBoost model loaded from {EXISTING_MODEL_PATH}")
        else:
            print(f" Existing business model not found: {EXISTING_MODEL_PATH}")
        
        # Load feature scaler
        if os.path.exists(EXISTING_SCALER_PATH):
            feature_scaler = joblib.load(EXISTING_SCALER_PATH)
            print(f"✓ Feature scaler loaded from {EXISTING_SCALER_PATH}")
        else:
            print(f" Feature scaler not found: {EXISTING_SCALER_PATH}")
        
        # Load label encoders
        if os.path.exists(EXISTING_ENCODERS_PATH):
            label_encoders = joblib.load(EXISTING_ENCODERS_PATH)
            print(f"✓ Label encoders loaded from {EXISTING_ENCODERS_PATH}")
        else:
            print(f" Label encoders not found: {EXISTING_ENCODERS_PATH}")
        
        # Load metadata
        if os.path.exists(EXISTING_METADATA_PATH):
            with open(EXISTING_METADATA_PATH, 'r') as f:
                model_metadata = json.load(f)
            print(f"✓ Model metadata loaded from {EXISTING_METADATA_PATH}")
        else:
            print(f" Metadata file not found: {EXISTING_METADATA_PATH}")
        
        # Define feature names for existing business (must match training order)
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
            'employment_fourth_year',
            'business_sector_encoded',
            'business_scaling_encoded',
            'employment_growth_encoded'
        ]
        
        print(" Combined SME Predictor API startup complete!")
        
    except Exception as e:
        print(f"Error loading existing business model components: {e}")

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
    recommendations: Optional[List[str]] = None  # Changed to List[str] for SHAP recommendations
    error: Optional[str] = None

class FeedbackData(BaseModel):
    """User feedback model"""
    name: Optional[str] = Field(None, description="User's name (optional)")
    email: Optional[str] = Field(None, description="User's email (optional)")
    prediction_type: str = Field(..., description="Type of prediction (new_business or existing_business)")
    message: str = Field(..., description="User's feedback or comment", min_length=1, max_length=1000)

# ===== EXISTING BUSINESS DATA MODELS =====

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

class ExistingBusinessPredictionResponse(BaseModel):
    """Response model for existing business prediction"""
    success: bool = Field(description="Whether the business is predicted to succeed (True) or fail (False)")
    prediction: str = Field(description="Human-readable prediction result: 'Success' or 'Failure'")
    success_probability: float = Field(description="Probability of success (0.0 to 1.0). Values above 0.5 indicate likely success")
    confidence: float = Field(description="Model confidence in the prediction (0.0 to 1.0). Higher values indicate more certainty")
    business_insights: Dict[str, Any] = Field(description="Key business metrics and performance indicators")
    recommendations: List[str] = Field(description="SHAP-based actionable business recommendations")
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
                    "1. Revenue Growth: Continue current growth strategy - performance indicators are strong",
                    "2. Workforce Management: Maintain current employment efficiency while planning for future needs",
                    "3. Strategic Scaling: Continue current scaling approach while monitoring key performance indicators",
                    "4. Capital Utilization: Optimize capital allocation for maximum return on investment",
                    "5. Market Leadership: Leverage strong performance to explore new markets and strategic partnerships"
                ],
                "risk_factors": [],
                "model_version": "20251106_133503",
                "timestamp": "2025-11-06T15:30:45.123456"
            }
        }
    }

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

def generate_new_business_recommendations(business_data: Dict[str, Any], success_probability: float, processed_data: pd.DataFrame) -> List[str]:
    """Generate SHAP-based business recommendations for new business"""
    
    try:
        # Create SHAP explainer for the new business model
        explainer = shap.TreeExplainer(trained_model)
        
        # Calculate SHAP values for this specific prediction
        shap_values = explainer.shap_values(processed_data)
        
        # Handle different SHAP output formats
        if isinstance(shap_values, list):
            # Binary classification - use positive class (index 1)
            shap_vals = shap_values[1][0] if len(shap_values) > 1 else shap_values[0][0]
        else:
            shap_vals = shap_values[0]
        
        # Get feature impacts with names (use PREDICTION_FEATURES order)
        feature_impacts = list(zip(PREDICTION_FEATURES, shap_vals))
        
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
            "1. Capital Management: Ensure adequate funding for business operations",
            "2. Experience Building: Leverage business experience for strategic decisions",
            "3. Market Position: Strengthen your position in the chosen business sector",
            "4. Location Strategy: Optimize business location for market access",
            "5. Growth Planning: Develop sustainable growth strategies for long-term success"
        ]

# ===== EXISTING BUSINESS HELPER FUNCTIONS =====

def engineer_features(data: ExistingBusinessData) -> Dict[str, float]:
    """Engineer features from existing business input data"""
    
    # Calculate revenue growth rate
    first_year = data.turnover_first_year
    third_year = data.turnover_third_year
    
    if first_year == 0:
        revenue_growth_rate = 300 if third_year > 0 else 0
    else:
        revenue_growth_rate = ((third_year - first_year) / first_year) * 100
    
    # Bound revenue growth rate to prevent extreme values
    revenue_growth_rate = max(min(revenue_growth_rate, 1000.0), -100.0)
    
    # Calculate revenue consistency score
    revenues = [data.turnover_first_year, data.turnover_second_year, data.turnover_third_year]
    revenue_std = np.std(revenues)
    revenue_mean = np.mean(revenues)
    revenue_consistency_score = 1 / (1 + (revenue_std / (revenue_mean + 1)))
    
    # Calculate employment efficiency
    current_revenue_per_employee = data.turnover_fourth_year / max(data.employment_fourth_year, 1)
    initial_revenue_per_employee = data.turnover_first_year / max(data.employment_first_year, 1)
    
    if initial_revenue_per_employee == 0:
        employment_efficiency = 2.0 if current_revenue_per_employee > 0 else 1.0
    else:
        employment_efficiency = current_revenue_per_employee / initial_revenue_per_employee
    
    # Bound employment_efficiency to prevent extreme values
    employment_efficiency = max(min(employment_efficiency, 10.0), 0.1)
    
    # Calculate capital efficiency
    total_revenue = data.turnover_first_year + data.turnover_second_year + data.turnover_third_year + data.turnover_fourth_year
    capital_efficiency = total_revenue / max(data.business_capital, 1)
    
    # Bound capital_efficiency to prevent extreme values
    capital_efficiency = max(min(capital_efficiency, 1000.0), 0.001)
    
    # Calculate revenue per employee trend
    revenue_per_employee_values = []
    for i in range(4):
        year_revenue = [data.turnover_first_year, data.turnover_second_year, data.turnover_third_year, data.turnover_fourth_year][i]
        year_employment = [data.employment_first_year, data.employment_second_year, data.employment_third_year, data.employment_fourth_year][i]
        rpe = year_revenue / max(year_employment, 1)
        revenue_per_employee_values.append(rpe)
    
    revenue_per_employee_trend = np.mean(np.diff(revenue_per_employee_values))
    
    # Bound revenue per employee trend to prevent extreme values
    revenue_per_employee_trend = max(min(revenue_per_employee_trend, 10000000), -10000000)
    
    # Calculate turnover growth automatically
    if data.turnover_fourth_year > data.turnover_first_year:
        turnover_growth = "Increased"
    elif data.turnover_fourth_year < data.turnover_first_year:
        turnover_growth = "Decreased"
    else:
        turnover_growth = "Stable"
    
    # Calculate employment growth automatically
    if data.employment_fourth_year > data.employment_first_year:
        employment_growth = "Increased"
    elif data.employment_fourth_year < data.employment_first_year:
        employment_growth = "Decreased"
    else:
        employment_growth = "Stable"
    
    # Calculate business scaling automatically based on revenue and employment growth
    revenue_change_pct = ((data.turnover_fourth_year - data.turnover_first_year) / max(data.turnover_first_year, 1)) * 100
    employment_change_pct = ((data.employment_fourth_year - data.employment_first_year) / max(data.employment_first_year, 1)) * 100
    
    avg_growth = (revenue_change_pct + employment_change_pct) / 2
    
    if avg_growth > 50:
        business_scaling = "High_Scaling"
    elif avg_growth > 10:
        business_scaling = "Medium_Scaling"
    else:
        business_scaling = "Low_Scaling"
    
    return {
        'revenue_growth_rate': revenue_growth_rate,
        'revenue_consistency_score': revenue_consistency_score,
        'employment_efficiency': employment_efficiency,
        'capital_efficiency': capital_efficiency,
        'current_revenue_per_employee': current_revenue_per_employee,
        'revenue_per_employee_trend': revenue_per_employee_trend,
        'turnover_growth': turnover_growth,
        'employment_growth': employment_growth,
        'business_scaling_indicator': business_scaling
    }

def encode_categorical_features(data: ExistingBusinessData, engineered: Dict[str, any]) -> Dict[str, int]:
    """Encode categorical features for existing business prediction"""
    
    # Business sector encoding - ALL 24 sectors from dataset
    sector_mapping = {
        'Other Service Activities': 0,
        'Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles': 1,
        'Transportation And Storage': 2,
        'Financial And Insurance Activities': 3,
        'Accommodation And Food Service Activities': 4,
        'Unclassified': 5,
        'Construction': 6,
        'Professional, Scientific And Technical Activities': 7,
        'Agriculture, Forestry And Fishing': 8,
        'Manufacturing': 9,
        'Information And Communication': 10,
        'Administrative And Support Service Activities': 11,
        'Education': 12,
        'Arts, Entertainment And Recreation': 13,
        'Human Health And Social Work Activities': 14,
        'Water Supply, Gas And Remediation Services': 15,
        'Mining And Quarrying': 16,
        'Real Estate Activities': 17,
        'Public Administration And Defence; Compulsory Social Security': 18,
        'Activities Of Households As Employers; Undifferentiated Goods- And Services-Producing Activities Of Households For Own Use': 19,
        'Electricity, Gas And Air Conditioning Supply': 20,
        'Activities Of Extraterritorial Organizations And Bodies': 21,
        'Motorcycle transport': 22,
        'Activities of Mobile Money Agents': 23,
        'Other': 24  # Fallback for unknown sectors
    }
    
    # Business scaling encoding
    scaling_mapping = {
        'High_Scaling': 0,
        'Mixed_Performance': 1,
        'Declining': 2
    }
    
    # Employment growth encoding - matching dataset values
    employment_mapping = {
        'Increased': 0,
        'Decreased': 1,
        'Stable': 2  # Changed from 'No_Change' to 'Stable' to match dataset
    }
    
    encoded = {
        'business_sector_encoded': sector_mapping.get(data.business_sector, 24),  # Default to 'Other' (index 24)
        'business_scaling_encoded': scaling_mapping.get(engineered['business_scaling_indicator'], 1),  # Use calculated value
        'employment_growth_encoded': employment_mapping.get(engineered['employment_growth'], 2)  # Use calculated value
    }
    
    return encoded

def generate_existing_business_recommendations(data: ExistingBusinessData, engineered: Dict, prediction_prob: float, input_features: np.ndarray) -> List[str]:
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
        risks.append("Below-average employment efficiency")
    
    # Capital efficiency risk
    if engineered['capital_efficiency'] < 0.5:
        risks.append("Low capital utilization efficiency")
    
    # Business scaling risk
    if engineered['business_scaling_indicator'] == 'Declining':
        risks.append("Business showing declining scaling indicators")
    
    # Revenue consistency risk
    if engineered['revenue_consistency_score'] < 0.6:
        risks.append("Inconsistent revenue patterns detected")
    
    return risks

# ===== API ENDPOINTS =====

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
        recommendations = generate_new_business_recommendations(data_dict, success_probability, processed_data)
        
        # Prepare response
        response = PredictionResponse(
            success=True,
            prediction=int(prediction),
            prediction_label="Successful" if prediction == 1 else "Unsuccessful",
            success_probability=round(success_probability, 4),
            confidence_level=confidence_level,
            recommendations=recommendations
        )
        
        # Log prediction
        log_prediction(
            prediction_type="new_business",
            input_data=data_dict,
            prediction_result={
                "prediction": int(prediction),
                "prediction_label": "Successful" if prediction == 1 else "Unsuccessful",
                "success_probability": round(success_probability, 4),
                "confidence_level": confidence_level
            }
        )
        
        return response
        
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

# ===== EXISTING BUSINESS ENDPOINTS =====

@app.post("/predict-existing-business", response_model=ExistingBusinessPredictionResponse, tags=["Existing Business"])
async def predict_existing_business_success(business_data: ExistingBusinessData):
    """Predict success probability for existing business with historical data and SHAP-based recommendations"""
    
    if xgb_model is None or feature_scaler is None or label_encoders is None:
        raise HTTPException(status_code=503, detail="Existing business prediction model not loaded")
    
    try:
        # Step 0: Sanitize input data to prevent model crashes
        business_data.business_capital = max(min(business_data.business_capital, 1000000000), 10000)
        business_data.employment_first_year = max(min(business_data.employment_first_year, 10000), 1)
        business_data.employment_second_year = max(min(business_data.employment_second_year, 10000), 1)
        business_data.employment_third_year = max(min(business_data.employment_third_year, 10000), 1)
        business_data.employment_fourth_year = max(min(business_data.employment_fourth_year, 10000), 1)
        business_data.turnover_first_year = max(min(business_data.turnover_first_year, 10000000000), 0)
        business_data.turnover_second_year = max(min(business_data.turnover_second_year, 10000000000), 0)
        business_data.turnover_third_year = max(min(business_data.turnover_third_year, 10000000000), 0)
        business_data.turnover_fourth_year = max(min(business_data.turnover_fourth_year, 10000000000), 0)
        
        # Step 1: Engineer features
        engineered = engineer_features(business_data)
        
        # Step 2: Encode categorical features
        encoded = encode_categorical_features(business_data, engineered)
        
        # Step 3: Create feature vector
        feature_vector = np.array([
            business_data.turnover_first_year,
            business_data.turnover_second_year, 
            business_data.turnover_third_year,
            business_data.turnover_fourth_year,
            business_data.employment_first_year,
            business_data.employment_second_year,
            business_data.employment_third_year,
            business_data.employment_fourth_year,
            engineered['revenue_per_employee_trend'],
            engineered['employment_efficiency'],
            business_data.business_capital,
            max(business_data.employment_fourth_year, 1),
            encoded['business_sector_encoded'],
            encoded['business_scaling_encoded'],
            encoded['employment_growth_encoded']
        ]).reshape(1, -1)
        
        # Step 4: Scale features
        try:
            feature_vector_scaled = feature_scaler.transform(feature_vector)
        except Exception as scaling_error:
            raise HTTPException(
                status_code=400, 
                detail=f"Input values outside valid business ranges. Please check your data and try again."
            )
        
        # Step 5: Make prediction with error handling
        try:
            prediction = xgb_model.predict(feature_vector_scaled)[0]
            probabilities = xgb_model.predict_proba(feature_vector_scaled)[0]
        except Exception as prediction_error:
            raise HTTPException(
                status_code=400, 
                detail=f"Unable to process prediction with provided data. Please verify input ranges."
            )
        
        success_probability = probabilities[1]
        confidence = max(probabilities[0], probabilities[1])
        prediction_label = "Success" if prediction == 1 else "Failure"
        
        # Step 6: Generate insights and recommendations
        recommendations = generate_existing_business_recommendations(business_data, engineered, success_probability, feature_vector_scaled)
        risk_factors = identify_risk_factors(business_data, engineered)
        
        # Step 7: Prepare business insights
        business_insights = {
            "revenue_growth_rate": round(engineered['revenue_growth_rate'], 2),
            "employment_growth": engineered['employment_growth'],
            "business_scaling": engineered['business_scaling_indicator'],
            "employment_efficiency": round(engineered['employment_efficiency'], 3),
            "revenue_consistency": round(engineered['revenue_consistency_score'], 3),
            "current_revenue_per_employee": round(engineered['current_revenue_per_employee'], 0),
            "capital_efficiency": round(engineered['capital_efficiency'], 3)
        }
        
        # Prepare response
        response = ExistingBusinessPredictionResponse(
            success=bool(prediction),
            prediction=prediction_label,
            success_probability=float(success_probability),
            confidence=float(confidence),
            business_insights=business_insights,
            recommendations=recommendations,
            risk_factors=risk_factors,
            model_version=model_metadata.get('version', MODEL_VERSION) if model_metadata else MODEL_VERSION,
            timestamp=datetime.now().isoformat()
        )
        
        # Log prediction
        log_prediction(
            prediction_type="existing_business",
            input_data=business_data.dict(),
            prediction_result={
                "prediction": prediction_label,
                "success_probability": float(success_probability),
                "confidence": float(confidence),
                "business_insights": business_insights
            }
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health-existing", tags=["Existing Business"])
async def health_check_existing():
    """Health check for existing business prediction model"""
    return {
        "status": "healthy" if all([xgb_model, feature_scaler, label_encoders]) else "unhealthy",
        "service": "Existing Business Prediction API", 
        "model_loaded": xgb_model is not None,
        "scaler_loaded": feature_scaler is not None,
        "encoders_loaded": label_encoders is not None,
        "features": "SHAP-based recommendations enabled",
        "model_version": MODEL_VERSION,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/sample-new-business", tags=["Samples"])
async def get_new_business_sample():
    """Get sample data for new business prediction testing"""
    return {
        "sample_data": {
            "business_capital": 1200000,
            "owner_age": 30,
            "owner_business_experience": 7,
            "capital_source": "Personal Savings",
            "business_sector": "Manufacturing",
            "number_of_employees": 0,
            "business_location": "RULINDO",
            "entity_type": "COOPERATIVE",
            "owner_gender": "M",
            "education_level_numeric": 0
        },
        "description": "Sample data for testing new business prediction",
        "usage": "POST this data to /predict endpoint"
    }

@app.get("/sample-existing-business", tags=["Samples"])
async def get_existing_business_sample():
    """Get sample data for existing business prediction testing"""
    return {
        "sample_data": {
            "business_capital": 25000000,
            "business_sector": "Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles",
            "entity_type": "PRIVATE CORPORATION",
            "business_location": "GASABO",
            "capital_source": "Bank Loan",
            "turnover_first_year": 12000000,
            "turnover_second_year": 18000000,
            "turnover_third_year": 24000000,
            "turnover_fourth_year": 30000000,
            "employment_first_year": 5,
            "employment_second_year": 8,
            "employment_third_year": 12,
            "employment_fourth_year": 15,
            "business_scaling": "High_Scaling",
            "employment_growth": "Increased"
        },
        "description": "Sample data for testing existing business prediction with 4-year historical data",
        "usage": "POST this data to /predict-existing-business endpoint"
    }

# ===== ADMIN DASHBOARD ENDPOINTS =====

@app.get("/admin/dashboard", tags=["Admin"])
async def get_admin_dashboard():
    """Get comprehensive admin dashboard statistics"""
    try:
        if not os.path.exists(PREDICTIONS_LOG_FILE):
            return {
                "total_predictions": 0,
                "new_business_predictions": 0,
                "existing_business_predictions": 0,
                "success_rate_new": 0,
                "success_rate_existing": 0,
                "predictions_today": 0,
                "recent_predictions": [],
                "message": "No predictions logged yet"
            }
        
        with open(PREDICTIONS_LOG_FILE, 'r') as f:
            logs = json.load(f)
        
        # Calculate statistics
        total_predictions = len(logs)
        new_business_count = sum(1 for log in logs if log["prediction_type"] == "new_business")
        existing_business_count = sum(1 for log in logs if log["prediction_type"] == "existing_business")
        
        # Calculate success rates
        new_success = sum(1 for log in logs if log["prediction_type"] == "new_business" and 
                         log["prediction_result"].get("prediction") == 1)
        existing_success = sum(1 for log in logs if log["prediction_type"] == "existing_business" and 
                              log["prediction_result"].get("prediction") == "Success")
        
        success_rate_new = round((new_success / new_business_count * 100), 2) if new_business_count > 0 else 0
        success_rate_existing = round((existing_success / existing_business_count * 100), 2) if existing_business_count > 0 else 0
        
        # Predictions today
        today = datetime.now().date().isoformat()
        predictions_today = sum(1 for log in logs if log["timestamp"].startswith(today))
        
        # Get recent predictions (last 10)
        recent_predictions = logs[-10:][::-1]  # Last 10 in reverse order
        
        # Predictions by date (last 7 days)
        from collections import defaultdict
        predictions_by_date = defaultdict(int)
        for log in logs:
            date = log["timestamp"].split("T")[0]
            predictions_by_date[date] += 1
        
        return {
            "total_predictions": total_predictions,
            "new_business_predictions": new_business_count,
            "existing_business_predictions": existing_business_count,
            "success_rate_new": success_rate_new,
            "success_rate_existing": success_rate_existing,
            "predictions_today": predictions_today,
            "predictions_by_date": dict(sorted(predictions_by_date.items())[-7:]),
            "recent_predictions": recent_predictions,
            "last_updated": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching dashboard data: {str(e)}")

@app.get("/admin/predictions", tags=["Admin"])
async def get_all_predictions(limit: int = 50, prediction_type: Optional[str] = None):
    """Get all logged predictions with optional filtering"""
    try:
        if not os.path.exists(PREDICTIONS_LOG_FILE):
            return {
                "total": 0,
                "predictions": [],
                "message": "No predictions logged yet"
            }
        
        with open(PREDICTIONS_LOG_FILE, 'r') as f:
            logs = json.load(f)
        
        # Filter by prediction type if specified
        if prediction_type:
            logs = [log for log in logs if log["prediction_type"] == prediction_type]
        
        # Apply limit and reverse order (newest first)
        limited_logs = logs[-limit:][::-1]
        
        return {
            "total": len(logs),
            "returned": len(limited_logs),
            "predictions": limited_logs,
            "filters": {"prediction_type": prediction_type, "limit": limit}
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching predictions: {str(e)}")

@app.get("/admin/stats", tags=["Admin"])
async def get_prediction_stats():
    """Get detailed prediction statistics"""
    try:
        if not os.path.exists(PREDICTIONS_LOG_FILE):
            return {"message": "No predictions logged yet"}
        
        with open(PREDICTIONS_LOG_FILE, 'r') as f:
            logs = json.load(f)
        
        # Statistics by prediction type
        stats = {
            "new_business": {
                "total": 0,
                "successful": 0,
                "unsuccessful": 0,
                "avg_success_probability": 0,
                "high_confidence": 0,
                "medium_confidence": 0,
                "low_confidence": 0
            },
            "existing_business": {
                "total": 0,
                "successful": 0,
                "unsuccessful": 0,
                "avg_success_probability": 0,
                "avg_confidence": 0
            }
        }
        
        # Process new business predictions
        new_business_logs = [log for log in logs if log["prediction_type"] == "new_business"]
        if new_business_logs:
            stats["new_business"]["total"] = len(new_business_logs)
            stats["new_business"]["successful"] = sum(1 for log in new_business_logs if log["prediction_result"].get("prediction") == 1)
            stats["new_business"]["unsuccessful"] = sum(1 for log in new_business_logs if log["prediction_result"].get("prediction") == 0)
            
            success_probs = [log["prediction_result"].get("success_probability", 0) for log in new_business_logs]
            stats["new_business"]["avg_success_probability"] = round(sum(success_probs) / len(success_probs), 4)
            
            stats["new_business"]["high_confidence"] = sum(1 for log in new_business_logs if log["prediction_result"].get("confidence_level") == "High")
            stats["new_business"]["medium_confidence"] = sum(1 for log in new_business_logs if log["prediction_result"].get("confidence_level") == "Medium")
            stats["new_business"]["low_confidence"] = sum(1 for log in new_business_logs if log["prediction_result"].get("confidence_level") == "Low")
        
        # Process existing business predictions
        existing_business_logs = [log for log in logs if log["prediction_type"] == "existing_business"]
        if existing_business_logs:
            stats["existing_business"]["total"] = len(existing_business_logs)
            stats["existing_business"]["successful"] = sum(1 for log in existing_business_logs if log["prediction_result"].get("prediction") == "Success")
            stats["existing_business"]["unsuccessful"] = sum(1 for log in existing_business_logs if log["prediction_result"].get("prediction") == "Failure")
            
            success_probs = [log["prediction_result"].get("success_probability", 0) for log in existing_business_logs]
            stats["existing_business"]["avg_success_probability"] = round(sum(success_probs) / len(success_probs), 4)
            
            confidences = [log["prediction_result"].get("confidence", 0) for log in existing_business_logs]
            stats["existing_business"]["avg_confidence"] = round(sum(confidences) / len(confidences), 4)
        
        return {
            "total_predictions": len(logs),
            "statistics": stats,
            "generated_at": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating statistics: {str(e)}")

@app.delete("/admin/predictions/clear", tags=["Admin"])
async def clear_prediction_logs():
    """Clear all prediction logs (use with caution!)"""
    try:
        if os.path.exists(PREDICTIONS_LOG_FILE):
            os.remove(PREDICTIONS_LOG_FILE)
            return {"message": "Prediction logs cleared successfully", "cleared_at": datetime.now().isoformat()}
        else:
            return {"message": "No prediction logs to clear"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing logs: {str(e)}")

# ===== FEEDBACK ENDPOINTS =====

@app.post("/feedback", tags=["Feedback"])
async def submit_feedback(feedback: FeedbackData):
    """Submit user feedback or comment"""
    try:
        # Load existing feedback
        if os.path.exists(FEEDBACK_LOG_FILE):
            with open(FEEDBACK_LOG_FILE, 'r') as f:
                feedback_logs = json.load(f)
        else:
            feedback_logs = []
        
        # Create new feedback entry
        feedback_entry = {
            "id": len(feedback_logs) + 1,
            "timestamp": datetime.now().isoformat(),
            "name": feedback.name,
            "email": feedback.email,
            "prediction_type": feedback.prediction_type,
            "message": feedback.message,
            "status": "unread"
        }
        
        # Append and save
        feedback_logs.append(feedback_entry)
        with open(FEEDBACK_LOG_FILE, 'w') as f:
            json.dump(feedback_logs, f, indent=2)
        
        return {
            "success": True,
            "message": "Thank you for your feedback!",
            "feedback_id": feedback_entry["id"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving feedback: {str(e)}")

@app.get("/admin/messages", tags=["Admin"])
async def get_all_messages(limit: int = 100, status: Optional[str] = None):
    """Get all user feedback messages"""
    try:
        if not os.path.exists(FEEDBACK_LOG_FILE):
            return {
                "total": 0,
                "unread": 0,
                "messages": [],
                "message": "No feedback messages yet"
            }
        
        with open(FEEDBACK_LOG_FILE, 'r') as f:
            messages = json.load(f)
        
        # Filter by status if provided
        if status:
            filtered_messages = [msg for msg in messages if msg.get("status") == status]
        else:
            filtered_messages = messages
        
        # Count unread
        unread_count = sum(1 for msg in messages if msg.get("status") == "unread")
        
        # Apply limit and reverse (newest first)
        limited_messages = filtered_messages[-limit:][::-1]
        
        return {
            "total": len(messages),
            "unread": unread_count,
            "returned": len(limited_messages),
            "messages": limited_messages,
            "filters": {"status": status, "limit": limit}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching messages: {str(e)}")

@app.patch("/admin/messages/{message_id}/read", tags=["Admin"])
async def mark_message_read(message_id: int):
    """Mark a message as read"""
    try:
        if not os.path.exists(FEEDBACK_LOG_FILE):
            raise HTTPException(status_code=404, detail="No messages found")
        
        with open(FEEDBACK_LOG_FILE, 'r') as f:
            messages = json.load(f)
        
        # Find and update message
        message_found = False
        for msg in messages:
            if msg["id"] == message_id:
                msg["status"] = "read"
                message_found = True
                break
        
        if not message_found:
            raise HTTPException(status_code=404, detail="Message not found")
        
        # Save updated messages
        with open(FEEDBACK_LOG_FILE, 'w') as f:
            json.dump(messages, f, indent=2)
        
        return {"success": True, "message": "Message marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating message: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print(" Starting Combined SME Predictor API...")
    print(" New Business API: /predict, /batch-predict, /categories")
    print(" Existing Business API: /predict-existing-business, /health-existing")
    print(" Sample Data: /sample-new-business, /sample-existing-business")
    print(" API Documentation: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)