"""
Test script for the SME Success Predictor API
"""

import unittest
import requests
import json
from datetime import datetime

# API base URL
BASE_URL = "http://localhost:8000/predict"


class TestSMEAPI(unittest.TestCase):
    """Test cases for SME Success Predictor API"""
    
    @classmethod
    def setUpClass(cls):
        """Set up test fixtures before running tests"""
        print("🧪 Testing SME Success Predictor API")
        print("=" * 50)
    
    def test_1_health_check(self):
        """Test health check endpoint"""
        try:
            response = requests.get(f"{BASE_URL}/health")
            self.assertEqual(response.status_code, 200, "Health check should return 200")
            
            health_data = response.json()
            self.assertIn('status', health_data, "Health response should contain status")
            self.assertIn('model_loaded', health_data, "Health response should contain model_loaded")
            
            print(f"✅ Health check")
            
        except Exception as e:
            print(f"❌ Health check")
            self.fail(f"Health check error: {e}")
    
    def test_2_categories_endpoint(self):
        """Test categories endpoint"""
        try:
            response = requests.get(f"{BASE_URL}/categories")
            self.assertEqual(response.status_code, 200, "Categories should return 200")
            
            categories = response.json()
            required_keys = ['capital_sources', 'business_sectors', 'business_locations', 'entity_types']
            
            for key in required_keys:
                self.assertIn(key, categories, f"Categories should contain {key}")
                self.assertIsInstance(categories[key], list, f"{key} should be a list")
                self.assertTrue(len(categories[key]) > 0, f"{key} should not be empty")
            
            print(f"✅ Categories loaded")
            
        except Exception as e:
            print(f"❌ Categories failed")
            self.fail(f"Categories error: {e}")
    
    def test_3_single_prediction(self):
        """Test single prediction endpoint"""
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
            
            self.assertEqual(response.status_code, 200, "Prediction should return 200")
            
            prediction = response.json()
            required_keys = ['prediction_label', 'success_probability', 'confidence_level', 'recommendations']
            
            for key in required_keys:
                self.assertIn(key, prediction, f"Prediction should contain {key}")
            
            self.assertIn(prediction['prediction_label'], ['Success', 'Failure', 'Successful'], 
                         "Prediction label should be Success, Failure, or Successful")
            self.assertGreaterEqual(prediction['success_probability'], 0, 
                                  "Success probability should be >= 0")
            self.assertLessEqual(prediction['success_probability'], 1, 
                               "Success probability should be <= 1")
            
            print(f"✅ Prediction successful")
            
        except Exception as e:
            print(f"❌ Prediction failed")
            self.fail(f"Prediction error: {e}")
    
    def test_4_batch_prediction(self):
        """Test batch prediction endpoint"""
        
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
            
            self.assertEqual(response.status_code, 200, "Batch prediction should return 200")
            
            batch_results = response.json()
            self.assertIn('predictions', batch_results, "Batch results should contain predictions")
            self.assertEqual(len(batch_results['predictions']), 2, "Should have 2 predictions")
            
            print(f"✅ Batch prediction")
                    
        except Exception as e:
            print(f"❌ Batch prediction")
            self.fail(f"Batch prediction error: {e}")
    
    def test_5_error_handling(self):
        """Test error handling with invalid data"""
        
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
            
            # Should return validation error (422) or handle gracefully (200 with error)
            if response.status_code == 422:
                print(f"✅ Error handling")
            elif response.status_code == 200:
                result = response.json()
                if not result.get('success', True):
                    print(f"✅ Error handling")
                else:
                    print(f"❌ Error handling failed - Invalid data should not succeed")
                    self.fail("Should not succeed with invalid data")
            else:
                print(f"❌ Error handling failed - Unexpected status code: {response.status_code}")
                self.fail(f"Unexpected status code: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error handling test failed - {str(e)}")
            self.fail(f"Error handling test failed: {e}")
    
    @classmethod
    def tearDownClass(cls):
        """Clean up after tests"""
        print(f"\n🎉 API testing completed!")
        print(f"📝 To start the API server, run: uvicorn main:app --reload")
        print(f"📖 API documentation available at: {BASE_URL}/docs")


if __name__ == "__main__":
    unittest.main(verbosity=2)