import unittest
import requests
import json

# Test the API endpoints
BASE_URL = "http://localhost:8000/docs#/default/predict_sme_success_predict_post"


class TestExistingBusinessAPI(unittest.TestCase):
    """Test cases for Existing Business Predictor API"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test fixtures before running tests"""
        print("🧪 Testing Existing Business Predictor API")
        print("=" * 50)
    
    def test_1_health_check(self):
        """Test health endpoint"""
        try:
            response = requests.get(f"{BASE_URL}/health")
            self.assertEqual(response.status_code, 200, "Health check should return 200")
            
            health_data = response.json()
            print(f"✅ Health check")
            
        except Exception as e:
            print(f"❌ Health check")
            self.fail(f"Health check failed: {e}")
    
    def test_2_existing_business_prediction(self):
        """Test existing business prediction endpoint"""
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
        
        try:
            response = requests.post(f"{BASE_URL}/predict-existing-business", json=test_data)
            self.assertEqual(response.status_code, 200, "Prediction should return 200")
            
            result = response.json()
            
            # Validate response structure
            required_fields = ['prediction', 'success_probability', 'confidence', 'recommendations']
            for field in required_fields:
                self.assertIn(field, result, f"Response should contain {field}")
            
            self.assertIn(result['prediction'], ['Success', 'Failure'], 
                         "Prediction should be Success or Failure")
            self.assertGreaterEqual(result['success_probability'], 0, 
                                  "Success probability should be >= 0")
            self.assertLessEqual(result['success_probability'], 1, 
                               "Success probability should be <= 1")
            self.assertIsInstance(result['recommendations'], list, 
                                "Recommendations should be a list")
            
            print(f"✅ Business prediction")
                
        except Exception as e:
            print(f"❌ Business prediction")
            self.fail(f"Prediction test failed: {e}")
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after tests"""
        print(f"\n🎉 Existing Business API testing completed!")
        print(f"📝 To start the API server, run: uvicorn main2:app --reload --port 8000")


if __name__ == "__main__":
    unittest.main(verbosity=2)