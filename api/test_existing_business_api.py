import requests
import json

# Test the API endpoints
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_prediction():
    """Test prediction endpoint"""
    try:
        # Sample data matching the frontend form
        test_data = {
            "business_capital": 25000000,
            "number_of_employees": 15,
            "business_sector": "Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles",
            "entity_type": "Private Limited Company",
            "turnover_first_year": 18000000,
            "turnover_second_year": 20000000,
            "turnover_third_year": 22000000,
            "turnover_fourth_year": 25000000,
            "employment_first_year": 10,
            "employment_second_year": 12,
            "employment_third_year": 14,
            "employment_fourth_year": 15,
            "business_scaling": "High_Scaling",
            "employment_growth": "Increased"
        }
        
        response = requests.post(f"{BASE_URL}/predict-existing-business", json=test_data)
        print(f"\nPrediction Test: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Prediction: {result['prediction']}")
            print(f"Success Probability: {result['success_probability']:.3f}")
            print(f"Confidence: {result['confidence']:.3f}")
            print(f"Number of Recommendations: {len(result['recommendations'])}")
            print("Recommendations:")
            for i, rec in enumerate(result['recommendations'], 1):
                print(f"  {rec}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"Prediction test failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Existing Business Predictor API...")
    print("=" * 50)
    
    # Test health endpoint
    if test_health():
        print("\n" + "=" * 50)
        # Test prediction endpoint
        test_prediction()
    else:
        print("API is not running. Please start it first using:")
        print("uvicorn main2:app --reload --port 8000")