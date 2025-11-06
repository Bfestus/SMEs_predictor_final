import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Charts and PDF generation are handled on the Result page

const API_BASE_URL = 'http://localhost:8000';

const ExistingBusinessPage = () => {
  const [formData, setFormData] = useState({
    business_capital: '',
    business_sector: '',
    entity_type: '',
    business_location: '',
    number_of_employees: '',
    capital_source: '',
    turnover_first_year: '',
    turnover_second_year: '',
    turnover_third_year: '',
    turnover_fourth_year: '',
    employment_first_year: '',
    employment_second_year: '',
    employment_third_year: '',
    employment_fourth_year: '',
    business_scaling: '',
    employment_growth: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const capitalSources = [
    'Bank Loan',
    'Personal Savings',
    'Government Grant',
    'Investor Funding',
    'Family & Friends',
    'Other'
  ];

  const businessSectors = [
    'Agriculture, Forestry And Fishing',
    'Information And Communication',
    'Manufacturing',
    'Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles',
    'Professional, Scientific And Technical Activities',
    'Human Health And Social Work Activities',
    'Education',
    'Accommodation And Food Service Activities',
    'Administrative And Support Service Activities',
    'Construction',
    'Transportation And Storage',
    'Financial And Insurance Activities',
    'Arts, Entertainment And Recreation',
    'Other Service Activities',
    'Real Estate Activities',
    'Public Administration And Defence; Compulsory Social Security',
    'Water Supply, Gas And Remediation Services',
    'Electricity, Gas And Air Conditioning Supply',
    'Mining And Quarrying',
    'Activities Of Households As Employers; Undifferentiated Goods- And Services-Producing Activities Of Households For Own Use',
    'Activities Of Extraterritorial Organizations And Bodies',
    'Unclassified'
  ];

  const businessLocations = [
    'BUGESERA', 'BURERA', 'GAKENKE', 'GASABO', 'GATSIBO', 'GICUMBI',
    'GISAGARA', 'HUYE', 'KAMONYI', 'KARONGI', 'KAYONZA', 'KICUKIRO',
    'KIREHE', 'MUHANGA', 'MUSANZE', 'NGOMA', 'NGORORERO', 'NYABIHU',
    'NYAGATARE', 'NYAMAGABE', 'NYAMASHEKE', 'NYANZA', 'NYARUGENGE',
    'NYARUGURU', 'RUBAVU', 'RUHANGO', 'RULINDO', 'RUSIZI', 'RUTSIRO', 'RWAMAGANA'
  ];

  const entityTypes = [
    'COOPERATIVE',
    'INDIVIDUAL',
    'JOINT VENTURE',
    'LIMITED LIABILITY COMPANY',
    'PARTNERSHIP',
    'PRIVATE CORPORATION',
    'SOLE PROPRIETORSHIP'
  ];

  const businessScalingOptions = [
    'High_Scaling',
    'Medium_Scaling', 
    'Low_Scaling'
  ];

  const employmentGrowthOptions = [
    'Increased',
    'Maintained',
    'Decreased'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      business_capital: '',
      business_sector: '',
      entity_type: '',
      business_location: '',
      number_of_employees: '',
      capital_source: '',
      turnover_first_year: '',
      turnover_second_year: '',
      turnover_third_year: '',
      turnover_fourth_year: '',
      employment_first_year: '',
      employment_second_year: '',
      employment_third_year: '',
      employment_fourth_year: '',
      business_scaling: '',
      employment_growth: ''
    });
    // clear any previous state and scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PDF and charts are handled on the Result page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert string numbers to appropriate types
      const processedData = {
        business_capital: parseFloat(formData.business_capital),
        business_sector: formData.business_sector,
        entity_type: formData.entity_type,
        business_location: formData.business_location,
        number_of_employees: parseInt(formData.number_of_employees),
        capital_source: formData.capital_source,
        turnover_first_year: parseFloat(formData.turnover_first_year),
        turnover_second_year: parseFloat(formData.turnover_second_year),
        turnover_third_year: parseFloat(formData.turnover_third_year),
        turnover_fourth_year: parseFloat(formData.turnover_fourth_year),
        employment_first_year: parseInt(formData.employment_first_year),
        employment_second_year: parseInt(formData.employment_second_year),
        employment_third_year: parseInt(formData.employment_third_year),
        employment_fourth_year: parseInt(formData.employment_fourth_year),
        business_scaling: formData.business_scaling,
        employment_growth: formData.employment_growth
      };

      console.log('Sending data to API:', processedData);
      const response = await axios.post(`${API_BASE_URL}/predict-existing-business`, processedData);
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        toast.success('Prediction completed successfully!');
        // Navigate to the Result page and pass prediction data with existing business flag
        navigate('/result', { 
          state: { 
            ...response.data, 
            isExistingBusiness: true 
          } 
        });
      } else {
        toast.error(response.data.error || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      if (error.response?.status === 422) {
        toast.error('Please check your input data');
      } else if (error.code === 'ECONNREFUSED') {
        toast.error('Cannot connect to API. Please ensure the server is running on port 8000.');
      } else {
        toast.error('Failed to get prediction. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-white py-12" style={{ fontFamily: "'Space Mono', monospace" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1a1a1a', fontFamily: "'Space Mono', monospace" }}>
            <span style={{ color: '#22c55e' }}>Existing Business</span> Success Predictor
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
            Enter your existing business operational and financial data to get an AI-powered prediction 
            of your success probability with personalized SHAP-based recommendations.
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div 
            className="card relative overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #072033 0%, #0b2740 100%)',
              color: 'white'
            }}
          >
            <div className="absolute inset-0" style={{ background: 'rgba(3, 10, 18, 0.45)' }}></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-semibold mb-8 text-center" style={{ color: '#e6f0ff', fontFamily: "'Space Mono', monospace" }}>
                Existing Business Analysis Form
              </h2>
            
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information Section */}
                <div className="bg-white/70 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace" }}>
                    📊 Business Fundamentals
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Business Capital (RWF) *
                      </label>
                      <input
                        type="number"
                        name="business_capital"
                        value={formData.business_capital}
                        onChange={handleInputChange}
                        placeholder="e.g., 1200000"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Number of Employees *
                      </label>
                      <input
                        type="number"
                        name="number_of_employees"
                        value={formData.number_of_employees}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Capital Source *
                      </label>
                      <select
                        name="capital_source"
                        value={formData.capital_source}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                      >
                        <option value="">Select capital source...</option>
                        {capitalSources.map(source => (
                          <option key={source} value={source}>{source}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Entity Type *
                      </label>
                      <select
                        name="entity_type"
                        value={formData.entity_type}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                      >
                        <option value="">Select entity type...</option>
                        {entityTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                      Business Sector *
                    </label>
                    <select
                      name="business_sector"
                      value={formData.business_sector}
                      onChange={handleInputChange}
                      className="form-select"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                      required
                    >
                      <option value="">Select business sector...</option>
                      {businessSectors.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                      Business Location (District) *
                    </label>
                    <select
                      name="business_location"
                      value={formData.business_location}
                      onChange={handleInputChange}
                      className="form-select"
                      style={{ fontFamily: "'Space Mono', monospace" }}
                      required
                    >
                      <option value="">Select district...</option>
                      {businessLocations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Revenue History Section */}
                <div className="bg-white/70 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace" }}>
                    <span className="mr-2">�</span> Revenue History (4 Years)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        1st Year Revenue (RWF) *
                      </label>
                      <input
                        type="number"
                        name="turnover_first_year"
                        value={formData.turnover_first_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 12000000"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        2nd Year Revenue (RWF) *
                      </label>
                      <input
                        type="number"
                        name="turnover_second_year"
                        value={formData.turnover_second_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 18000000"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        3rd Year Revenue (RWF) *
                      </label>
                      <input
                        type="number"
                        name="turnover_third_year"
                        value={formData.turnover_third_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 24000000"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        4th Year Revenue (RWF) *
                      </label>
                      <input
                        type="number"
                        name="turnover_fourth_year"
                        value={formData.turnover_fourth_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 30000000"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment History Section */}
                <div className="bg-white/70 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace" }}>
                    <span className="mr-2">👥</span> Employment History (4 Years)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        1st Year Employees *
                      </label>
                      <input
                        type="number"
                        name="employment_first_year"
                        value={formData.employment_first_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        2nd Year Employees *
                      </label>
                      <input
                        type="number"
                        name="employment_second_year"
                        value={formData.employment_second_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 8"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        3rd Year Employees *
                      </label>
                      <input
                        type="number"
                        name="employment_third_year"
                        value={formData.employment_third_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 12"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        4th Year Employees *
                      </label>
                      <input
                        type="number"
                        name="employment_fourth_year"
                        value={formData.employment_fourth_year}
                        onChange={handleInputChange}
                        placeholder="e.g., 15"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Performance Section */}
                <div className="bg-white/70 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: '#22c55e', fontFamily: "'Space Mono', monospace" }}>
                    <span className="mr-2">📈</span> Performance Indicators
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Business Scaling *
                      </label>
                      <select
                        name="business_scaling"
                        value={formData.business_scaling}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                      >
                        <option value="">Select scaling level...</option>
                        {businessScalingOptions.map(option => (
                          <option key={option} value={option}>
                            {option.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Employment Growth *
                      </label>
                      <select
                        name="employment_growth"
                        value={formData.employment_growth}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                      >
                        <option value="">Select growth pattern...</option>
                        {employmentGrowthOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary text-lg py-4 px-12 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <div className="spinner mr-3"></div>
                        Analyzing Business Performance...
                      </span>
                    ) : (
                      'Get Success Prediction & Recommendations'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};

export default ExistingBusinessPage;