import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Charts and PDF generation are handled on the Result page

const API_BASE_URL = 'http://localhost:8000';

const PreInvestmentPage = () => {
  const [formData, setFormData] = useState({
    business_capital: '',
    owner_age: '',
    owner_business_experience: '',
    capital_source: '',
    business_sector: '',
    number_of_employees: '',
    business_location: '',
    entity_type: '',
    owner_gender: '',
    education_level_numeric: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const capitalSources = [
    'Personal Savings', 'Bank Loan', 'Business Partner', 'Microfinance',
    'Family/Friends', 'Government Grant', 'Foreign Investment', 
    'Venture Capital', 'Crowdfunding', 'Inheritance'
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

  const entityTypes = ['INDIVIDUAL', 'PRIVATE CORPORATION', 'COOPERATIVE', 'JOINT VENTURE'];

  const educationLevels = [
    { value: 0, label: '0 - No formal education' },
    { value: 1, label: '1 - Primary education' },
    { value: 2, label: '2 - Secondary education' },
    { value: 3, label: '3 - Tertiary education' },
    { value: 4, label: '4 - Higher education' }
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
      owner_age: '',
      owner_business_experience: '',
      capital_source: '',
      business_sector: '',
      number_of_employees: '',
      business_location: '',
      entity_type: '',
      owner_gender: '',
      education_level_numeric: ''
    });
    // clear any previous state and scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // PDF and charts are handled on the Result page

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert string numbers to integers
      const processedData = {
        ...formData,
        business_capital: parseInt(formData.business_capital),
        owner_age: parseInt(formData.owner_age),
        owner_business_experience: parseInt(formData.owner_business_experience),
        number_of_employees: parseInt(formData.number_of_employees),
        education_level_numeric: parseInt(formData.education_level_numeric)
      };

      const response = await axios.post(`${API_BASE_URL}/predict`, processedData);
      
      if (response.data.success) {
        toast.success('Prediction completed successfully!');
        // Navigate to the Result page and pass prediction data
        navigate('/result', { state: response.data });
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
            <span style={{ color: '#4a90e2' }}>SME Success</span> Predictor
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
            Enter your business details below to get an AI-powered prediction of your success probability,
            along with personalized recommendations for improvement.
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
                Business Information Form
              </h2>
            
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information Section */}
                <div className="bg-white/70 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6" style={{ color: '#a8d0ff', fontFamily: "'Space Mono', monospace" }}>
                    Business Information
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

                {/* Owner Information Section */}
                <div className="bg-white/70 rounded-lg p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-6 flex items-center" style={{ color: '#4a90e2', fontFamily: "'Space Mono', monospace" }}>
                    <span className="mr-2">👤</span> Owner Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Owner Age *
                      </label>
                      <input
                        type="number"
                        name="owner_age"
                        value={formData.owner_age}
                        onChange={handleInputChange}
                        placeholder="e.g., 30"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="18"
                        max="80"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Business Experience (Years) *
                      </label>
                      <input
                        type="number"
                        name="owner_business_experience"
                        value={formData.owner_business_experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 7"
                        className="form-input"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                        min="0"
                        max="50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Owner Gender *
                      </label>
                      <select
                        name="owner_gender"
                        value={formData.owner_gender}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                      >
                        <option value="">Select gender...</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                        Education Level *
                      </label>
                      <select
                        name="education_level_numeric"
                        value={formData.education_level_numeric}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                        required
                      >
                        <option value="">Select education level...</option>
                        {educationLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
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
                        Analyzing Business...
                      </span>
                    ) : (
                      'Predict Business Success'
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

export default PreInvestmentPage;