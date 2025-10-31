# SME Success Predictor API

A FastAPI-based REST API for predicting the success probability of Small and Medium Enterprises (SMEs) in Rwanda using machine learning.

## 🚀 Features

- **Single Prediction**: Predict success probability for individual businesses
- **Batch Prediction**: Process multiple businesses at once (up to 100)
- **Business Recommendations**: Get actionable insights and recommendations
- **Input Validation**: Comprehensive data validation and error handling
- **Interactive Documentation**: Auto-generated OpenAPI/Swagger docs
- **CORS Support**: Frontend integration ready
- **Real-time Testing**: Built-in test frontend interface

## 🛠️ Installation

### Prerequisites
- Python 3.8 or higher
- The trained XGBoost model file (`sme_success_predictor_xgboost_20251031_075224.joblib`)

### Step 1: Install Dependencies
```bash
cd api
pip install -r requirements.txt
```

### Step 2: Verify Model Path
Ensure the model file is located at:
```
../models/sme_success_predictor_xgboost_20251031_075224.joblib
```

### Step 3: Start the API Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## 📖 API Documentation

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Test Frontend
- **Web Interface**: Open `frontend.html` in your browser

## 🔗 API Endpoints

### Health Check
```http
GET /health
```
Returns API status and model loading status.

### Get Categories
```http
GET /categories
```
Returns all available options for categorical features.

### Single Prediction
```http
POST /predict
```

**Request Body:**
```json
{
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
}
```

**Response:**
```json
{
  "success": true,
  "prediction": 0,
  "prediction_label": "Unsuccessful",
  "success_probability": 0.1842,
  "confidence_level": "Medium",
  "recommendations": {
    "overall_assessment": "Business faces challenges but has potential for improvement.",
    "key_strengths": ["Optimal age range for business leadership"],
    "improvement_areas": ["Consider increasing initial capital"],
    "action_items": ["Explore additional funding sources or microfinance options"],
    "risk_level": "High Risk"
  }
}
```

### Batch Prediction
```http
POST /batch-predict
```

**Request Body:** Array of business objects (max 100)

## 📊 Input Features

| Feature | Type | Description | Example |
|---------|------|-------------|---------|
| `business_capital` | float | Business capital in RWF | 1200000 |
| `owner_age` | int | Age of business owner | 30 |
| `owner_business_experience` | int | Years of business experience | 7 |
| `capital_source` | string | Source of business capital | "Personal Savings" |
| `business_sector` | string | Business industry sector | "Manufacturing" |
| `number_of_employees` | int | Number of employees | 0 |
| `business_location` | string | Business district location | "RULINDO" |
| `entity_type` | string | Type of business entity | "COOPERATIVE" |
| `owner_gender` | string | Owner gender (M/F) | "M" |
| `education_level_numeric` | int | Education level (0-4 scale) | 0 |

### Valid Options for Categorical Features

#### Capital Sources
- Personal Savings
- Bank Loan
- Business Partner
- Microfinance
- Family/Friends
- Government Grant
- Foreign Investment
- Venture Capital
- Crowdfunding
- Inheritance

#### Entity Types
- INDIVIDUAL
- PRIVATE CORPORATION
- COOPERATIVE
- JOINT VENTURE

#### Business Locations (All 30 Districts of Rwanda)
BUGESERA, BURERA, GAKENKE, GASABO, GATSIBO, GICUMBI, GISAGARA, HUYE, KAMONYI, KARONGI, KAYONZA, KICUKIRO, KIREHE, MUHANGA, MUSANZE, NGOMA, NGORORERO, NYABIHU, NYAGATARE, NYAMAGABE, NYAMASHEKE, NYANZA, NYARUGENGE, NYARUGURU, RUBAVU, RUHANGO, RULINDO, RUSIZI, RUTSIRO, RWAMAGANA

#### Business Sectors (22 sectors)
- Agriculture, Forestry And Fishing
- Information And Communication
- Manufacturing
- Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles
- Professional, Scientific And Technical Activities
- Human Health And Social Work Activities
- Education
- Accommodation And Food Service Activities
- Administrative And Support Service Activities
- Construction
- Transportation And Storage
- Financial And Insurance Activities
- Arts, Entertainment And Recreation
- Other Service Activities
- Real Estate Activities
- Public Administration And Defence; Compulsory Social Security
- Water Supply, Gas And Remediation Services
- Electricity, Gas And Air Conditioning Supply
- Mining And Quarrying
- Activities Of Households As Employers; Undifferentiated Goods- And Services-Producing Activities Of Households For Own Use
- Activities Of Extraterritorial Organizations And Bodies
- Unclassified

## 🧪 Testing

### Run the Test Script
```bash
python test_api.py
```

### Manual Testing with curl
```bash
# Health check
curl http://localhost:8000/health

# Get categories
curl http://localhost:8000/categories

# Make prediction
curl -X POST "http://localhost:8000/predict" \
     -H "Content-Type: application/json" \
     -d '{
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
     }'
```

## 🔧 Configuration

### Environment Variables
- `MODEL_PATH`: Custom path to the model file
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8000)

### CORS Configuration
Update the CORS settings in `main.py` for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Replace with your domain
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
```

## 🚀 Deployment

### Local Development
```bash
uvicorn main:app --reload
```

### Production
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker (Optional)
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📈 Model Information

- **Algorithm**: XGBoost Classifier
- **Training Data**: 10,000 Rwandan SME records
- **Features**: 10 business and owner characteristics
- **Currency**: Rwandan Francs (RWF)
- **Accuracy**: Validated prediction pipeline with consistency testing

## 🤝 Usage Examples

### Python Client
```python
import requests

# Single prediction
business_data = {
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
}

response = requests.post(
    "http://localhost:8000/predict",
    json=business_data
)

result = response.json()
print(f"Success Probability: {result['success_probability']:.1%}")
print(f"Recommendation: {result['recommendations']['overall_assessment']}")
```

### JavaScript Client
```javascript
const businessData = {
    business_capital: 1500000,
    owner_age: 35,
    owner_business_experience: 10,
    capital_source: "Bank Loan",
    business_sector: "Information And Communication",
    number_of_employees: 3,
    business_location: "GASABO",
    entity_type: "PRIVATE CORPORATION",
    owner_gender: "F",
    education_level_numeric: 3
};

fetch('http://localhost:8000/predict', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(businessData)
})
.then(response => response.json())
.then(result => {
    console.log('Success Probability:', result.success_probability);
    console.log('Recommendations:', result.recommendations);
});
```

## 📞 Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the test examples in `test_api.py`
3. Verify model file path and dependencies
4. Check server logs for detailed error messages

## 📝 Notes

- All monetary values should be in Rwandan Francs (RWF)
- The model was trained on Rwandan SME data (2024)
- Predictions are probabilistic and should be used as guidance
- Regular model retraining is recommended with new data