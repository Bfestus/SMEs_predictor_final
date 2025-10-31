"""
Test script for the SME Success Predictor API
"""

import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000"

def test_api():
    """Test the SME Success Predictor API"""
    
    print("🧪 Testing SME Success Predictor API")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"✓ Health check passed")
            print(f"  Status: {health_data['status']}")
            print(f"  Model loaded: {health_data['model_loaded']}")
        else:
            print(f"✗ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Health check error: {e}")
    
    # Test 2: Get categories
    print("\n2. Testing Categories Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/categories")
        if response.status_code == 200:
            categories = response.json()
            print(f"✓ Categories retrieved successfully")
            print(f"  Capital sources: {len(categories['capital_sources'])} options")
            print(f"  Business sectors: {len(categories['business_sectors'])} options")
            print(f"  Locations: {len(categories['business_locations'])} districts")
            print(f"  Entity types: {len(categories['entity_types'])} types")
        else:
            print(f"✗ Categories request failed: {response.status_code}")
    except Exception as e:
        print(f"✗ Categories error: {e}")
    
    # Test 3: Single prediction
    print("\n3. Testing Single Prediction...")
    sample_business = {
        "business_capital": 1200000,  # 1.2M RWF
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
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=sample_business,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            prediction = response.json()
            print(f"✓ Prediction successful")
            print(f"  Business: {sample_business['business_sector']}, Capital: RWF {sample_business['business_capital']:,}")
            print(f"  Prediction: {prediction['prediction_label']}")
            print(f"  Success Probability: {prediction['success_probability']:.1%}")
            print(f"  Confidence: {prediction['confidence_level']}")
            print(f"  Risk Level: {prediction['recommendations']['risk_level']}")
            print(f"  Assessment: {prediction['recommendations']['overall_assessment']}")
        else:
            print(f"✗ Prediction failed: {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"✗ Prediction error: {e}")
    
    # Test 4: Batch prediction
    print("\n4. Testing Batch Prediction...")
    batch_businesses = [
        {
            "business_capital": 2500000,  # 2.5M RWF
            "owner_age": 35,
            "owner_business_experience": 12,
            "capital_source": "Bank Loan",
            "business_sector": "Information And Communication",
            "number_of_employees": 5,
            "business_location": "GASABO",
            "entity_type": "PRIVATE CORPORATION",
            "owner_gender": "F",
            "education_level_numeric": 3
        },
        {
            "business_capital": 800000,  # 800K RWF
            "owner_age": 25,
            "owner_business_experience": 2,
            "capital_source": "Family/Friends",
            "business_sector": "Agriculture, Forestry And Fishing",
            "number_of_employees": 1,
            "business_location": "HUYE",
            "entity_type": "INDIVIDUAL",
            "owner_gender": "M",
            "education_level_numeric": 1
        }
    ]
    
    try:
        response = requests.post(
            f"{BASE_URL}/batch-predict",
            json=batch_businesses,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            batch_results = response.json()
            print(f"✓ Batch prediction successful")
            print(f"  Processed {len(batch_results['predictions'])} businesses")
            
            for result in batch_results['predictions']:
                business_id = result['business_id']
                pred_result = result['result']
                if pred_result['success']:
                    print(f"  Business {business_id}: {pred_result['prediction_label']} ({pred_result['success_probability']:.1%})")
                else:
                    print(f"  Business {business_id}: Error - {pred_result['error']}")
        else:
            print(f"✗ Batch prediction failed: {response.status_code}")
            print(f"  Response: {response.text}")
    except Exception as e:
        print(f"✗ Batch prediction error: {e}")
    
    # Test 5: Error handling (invalid data)
    print("\n5. Testing Error Handling...")
    invalid_business = {
        "business_capital": "invalid",  # Invalid type
        "owner_age": 30,
        "owner_business_experience": 7,
        "capital_source": "Unknown Source",  # Invalid category
        "business_sector": "Manufacturing",
        "number_of_employees": 0,
        "business_location": "RULINDO",
        "entity_type": "COOPERATIVE",
        "owner_gender": "M",
        "education_level_numeric": 0
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=invalid_business,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 422:
            print(f"✓ Validation error handled correctly (422)")
        elif response.status_code == 200:
            result = response.json()
            if not result['success']:
                print(f"✓ Error handled gracefully: {result['error']}")
            else:
                print(f"? Unexpected success with invalid data")
        else:
            print(f"? Unexpected status code: {response.status_code}")
    except Exception as e:
        print(f"✗ Error handling test failed: {e}")
    
    print(f"\n🎉 API testing completed!")
    print(f"📝 To start the API server, run: uvicorn main:app --reload")
    print(f"📖 API documentation available at: http://localhost:8000/docs")

if __name__ == "__main__":
    test_api()