import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

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
    employment_fourth_year: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [showError, setShowError] = useState(false);

  const capitalSources = [
    'Personal Savings', 'Bank Loan', 'Business Partner', 'Microfinance',
    'Family/Friends', 'Government Grant', 'Foreign Investment', 'Venture Capital',
    'Crowdfunding', 'Inheritance', 'Business Incubator', 'Angel Investment'
  ];

  const businessSectors = [
    'Agriculture, Forestry And Fishing', 'Information And Communication', 'Manufacturing',
    'Wholesale And Retail Trade; Repair Of Motor Vehicles And Motorcycles',
    'Professional, Scientific And Technical Activities', 'Human Health And Social Work Activities',
    'Education', 'Accommodation And Food Service Activities', 'Administrative And Support Service Activities',
    'Construction', 'Transportation And Storage', 'Financial And Insurance Activities',
    'Arts, Entertainment And Recreation', 'Other Service Activities', 'Real Estate Activities',
    'Public Administration And Defence; Compulsory Social Security',
    'Water Supply, Gas And Remediation Services', 'Electricity, Gas And Air Conditioning Supply',
    'Mining And Quarrying', 
    'Activities Of Households As Employers; Undifferentiated Goods- And Services-Producing Activities Of Households For Own Use',
    'Activities Of Extraterritorial Organizations And Bodies', 'Unclassified',
    'Motorcycle transport', 'Activities of Mobile Money Agents'
  ];

  const businessLocations = [
    'BUGESERA', 'BURERA', 'GAKENKE', 'GASABO', 'GATSIBO', 'GICUMBI',
    'GISAGARA', 'HUYE', 'KAMONYI', 'KARONGI', 'KAYONZA', 'KICUKIRO',
    'KIREHE', 'MUHANGA', 'MUSANZE', 'NGOMA', 'NGORORERO', 'NYABIHU',
    'NYAGATARE', 'NYAMAGABE', 'NYAMASHEKE', 'NYANZA', 'NYARUGENGE',
    'NYARUGURU', 'RUBAVU', 'RUHANGO', 'RULINDO', 'RUSIZI', 'RUTSIRO', 'RWAMAGANA'
  ];

  const entityTypes = [
    'INDIVIDUAL', 'PRIVATE CORPORATION', 'COOPERATIVE', 'JOINT VENTURE',
    'LIMITED LIABILITY COMPANY', 'PARTNERSHIP', 'SOLE PROPRIETORSHIP'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      business_capital: '', business_sector: '', entity_type: '', business_location: '',
      number_of_employees: '', capital_source: '', turnover_first_year: '',
      turnover_second_year: '', turnover_third_year: '', turnover_fourth_year: '',
      employment_first_year: '', employment_second_year: '', employment_third_year: '',
      employment_fourth_year: ''
    });
    setPredictionResult(null);
    setShowResults(false);
    setErrorDetails(null);
    setShowError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyResults = () => {
    const resultsText = document.getElementById('results').innerText;
    navigator.clipboard.writeText(resultsText).then(() => {
      toast.success('Results copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy results');
    });
  };

  const hideError = () => {
    setErrorDetails(null);
    setShowError(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorDetails(null);
    setShowError(false);
    setShowResults(false);

    try {
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
        employment_fourth_year: parseInt(formData.employment_fourth_year)
      };

      console.log('Sending data to API:', processedData);
      
      const response = await axios.post(`${API_BASE_URL}/predict-existing-business`, processedData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });
      
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);

      if (response.data.success) {
        toast.success('Prediction completed successfully!');
        setPredictionResult(response.data);
        setShowResults(true);
        setTimeout(() => {
          const resultsElement = document.getElementById('prediction-results');
          if (resultsElement) {
            resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        const errorMessage = response.data.error || response.data.detail || 'Prediction failed';
        toast.error(errorMessage);
        setErrorDetails({
          type: 'API Error',
          message: errorMessage,
          response: response.data,
          timestamp: new Date().toISOString()
        });
        setShowError(true);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      
      let errorMessage = 'Failed to get prediction. Please try again.';
      let errorType = 'Unknown Error';
      let errorData = {};
      
      if (error.response) {
        errorType = `HTTP ${error.response.status} Error`;
        errorData = {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        };
        
        if (error.response.status === 422) {
          errorMessage = 'Validation Error: Please check your input data';
          if (error.response.data?.detail) {
            if (Array.isArray(error.response.data.detail)) {
              errorMessage += '\n\nValidation Issues:\n' + 
                error.response.data.detail.map(item => 
                  `• ${item.loc?.join('.')} - ${item.msg}`
                ).join('\n');
            } else {
              errorMessage += `\n\nDetails: ${error.response.data.detail}`;
            }
          }
        } else if (error.response.status === 500) {
          errorMessage = 'Server Error: Internal server error occurred';
        } else if (error.response.status === 404) {
          errorMessage = 'API Endpoint Not Found';
        }
      } else if (error.request) {
        errorType = 'Network Error';
        errorMessage = 'Cannot connect to API server. Please ensure the server is running on port 8000.';
        errorData = { request: error.request, code: error.code };
      } else {
        errorType = 'Request Setup Error';
        errorMessage = `Error setting up request: ${error.message}`;
        errorData = { message: error.message, stack: error.stack };
      }
      
      toast.error(errorMessage);
      setErrorDetails({
        type: errorType,
        message: errorMessage,
        error: errorData,
        timestamp: new Date().toISOString()
      });
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'Space Mono', monospace",
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: 'white',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '10px',
            background: 'linear-gradient(45deg, #22c55e, #10b981)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Existing Business Success Predictor
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
            AI-powered analysis of your business performance with SHAP-based recommendations
          </p>
        </div>

        {/* Form Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Business Information Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: '#22c55e',
                marginBottom: '20px',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                Business Fundamentals
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Business Capital (RWF) *
                  </label>
                  <input
                    type="number"
                    name="business_capital"
                    value={formData.business_capital}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="e.g., 1200000"
                    style={{
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Number of Employees *
                  </label>
                  <input
                    type="number"
                    name="number_of_employees"
                    value={formData.number_of_employees}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="e.g., 5"
                    style={{
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Capital Source *
                  </label>
                  <select
                    name="capital_source"
                    value={formData.capital_source}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select capital source...</option>
                    {capitalSources.map(source => (
                      <option key={source} value={source} style={{ background: '#1e293b', color: 'white' }}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Entity Type *
                  </label>
                  <select
                    name="entity_type"
                    value={formData.entity_type}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select entity type...</option>
                    {entityTypes.map(type => (
                      <option key={type} value={type} style={{ background: '#1e293b', color: 'white' }}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Business Sector *
                  </label>
                  <select
                    name="business_sector"
                    value={formData.business_sector}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select business sector...</option>
                    {businessSectors.map(sector => (
                      <option key={sector} value={sector} style={{ background: '#1e293b', color: 'white' }}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Business Location (District) *
                  </label>
                  <select
                    name="business_location"
                    value={formData.business_location}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '12px 16px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select district...</option>
                    {businessLocations.map(location => (
                      <option key={location} value={location} style={{ background: '#1e293b', color: 'white' }}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Revenue History Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: '#22c55e',
                marginBottom: '20px',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                Revenue History (4 Years)
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {['first', 'second', 'third', 'fourth'].map((year, index) => (
                  <div key={year} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                      {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Year Revenue (RWF) *
                    </label>
                    <input
                      type="number"
                      name={`turnover_${year}_year`}
                      value={formData[`turnover_${year}_year`]}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder={`e.g., ${12000000 + (index * 6000000)}`}
                      style={{
                        padding: '12px 16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '14px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Employment History Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: '#22c55e',
                marginBottom: '20px',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                Employment History (4 Years)
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {['first', 'second', 'third', 'fourth'].map((year, index) => (
                  <div key={year} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                      {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Year Employees *
                    </label>
                    <input
                      type="number"
                      name={`employment_${year}_year`}
                      value={formData[`employment_${year}_year`]}
                      onChange={handleInputChange}
                      required
                      min="0"
                      placeholder={`e.g., ${5 + (index * 3)}`}
                      style={{
                        padding: '12px 16px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '14px'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                background: isLoading ? 'rgba(34, 197, 94, 0.6)' : 'linear-gradient(45deg, #22c55e, #10b981)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '10px',
                fontFamily: "'Space Mono', monospace",
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                width: '100%',
                maxWidth: '400px',
                margin: '20px auto',
                display: 'block',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(34, 197, 94, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div style={{
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '4px solid #22c55e',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Analyzing your business performance...
                </span>
              ) : (
                'Get AI Prediction & Recommendations'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {showResults && predictionResult && (
          <div
            id="prediction-results"
            style={{
              background: predictionResult.prediction === 'Success' 
                ? 'rgba(34, 197, 94, 0.1)' 
                : 'rgba(239, 68, 68, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              marginTop: '30px',
              border: `1px solid ${predictionResult.prediction === 'Success' ? '#22c55e' : '#ef4444'}`
            }}
          >
            <h2 style={{
              textAlign: 'center',
              fontSize: '2rem',
              marginBottom: '20px',
              color: predictionResult.prediction === 'Success' ? '#22c55e' : '#ef4444'
            }}>
              {predictionResult.prediction === 'Success' ? 'Business Success Prediction' : 'Business Risk Assessment'}
            </h2>

            {/* Main Prediction Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: predictionResult.prediction === 'Success' 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                border: `2px solid ${predictionResult.prediction === 'Success' ? '#22c55e' : '#ef4444'}`,
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Prediction Result</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: predictionResult.prediction === 'Success' ? '#22c55e' : '#ef4444'
                }}>
                  {predictionResult.prediction}
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '2px solid #3b82f6',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Success Probability</div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#3b82f6'
                }}>
                  {(predictionResult.success_probability * 100).toFixed(1)}%
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.2)',
                border: '2px solid #a855f7',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Model Confidence</div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#a855f7'
                }}>
                  {(predictionResult.confidence * 100).toFixed(1)}%
                </div>
              </div>

              {predictionResult.model_version && (
                <div style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  borderRadius: '15px',
                  padding: '25px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Model Version</div>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#22c55e'
                  }}>
                    {predictionResult.model_version}
                  </div>
                </div>
              )}
            </div>

            {/* Timestamp */}
            {predictionResult.timestamp && (
              <div style={{ 
                textAlign: 'center', 
                fontSize: '0.9rem', 
                opacity: 0.8, 
                marginBottom: '30px',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                Analysis completed: {new Date(predictionResult.timestamp).toLocaleString()}
              </div>
            )}

            {/* Business Insights */}
            {predictionResult.business_insights && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '5px' }}>Revenue Growth</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {predictionResult.business_insights.revenue_growth_rate?.toFixed(1) || 'N/A'}%
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '5px' }}>Employment Growth</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {predictionResult.business_insights.employment_growth || 'N/A'}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '5px' }}>Business Scaling</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {predictionResult.business_insights.business_scaling || 'N/A'}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '5px' }}>Employment Efficiency</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {predictionResult.business_insights.employment_efficiency?.toFixed(2) || 'N/A'}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '5px' }}>Revenue per Employee</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {predictionResult.business_insights.current_revenue_per_employee?.toLocaleString() || 'N/A'} RWF
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '5px' }}>Capital Efficiency</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                    {predictionResult.business_insights.capital_efficiency?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ 
                  color: '#22c55e', 
                  marginBottom: '15px',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  AI-Powered Recommendations ({predictionResult.recommendations.length})
                </h3>
                <div>
                  {predictionResult.recommendations.map((rec, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}>
                        {rec}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {predictionResult.risk_factors && predictionResult.risk_factors.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ 
                  color: '#ef4444', 
                  marginBottom: '15px',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  Risk Factors ({predictionResult.risk_factors.length})
                </h3>
                <div>
                  {predictionResult.risk_factors.map((risk, index) => (
                    <div key={index} style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      padding: '15px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#ef4444'
                      }}>
                        {risk}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center',
              marginTop: '30px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={resetForm}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontFamily: "'Space Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                Analyze Another Business
              </button>
              
              <button
                onClick={() => window.print()}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontFamily: "'Space Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                Print Results
              </button>
              
              <button
                onClick={copyResults}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontFamily: "'Space Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
              >
                Copy Results
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {showError && errorDetails && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #ef4444',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '20px'
          }}>
            <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>Prediction Error</h3>
            <p style={{ marginBottom: '15px' }}>{errorDetails.message}</p>
            
            <details style={{ marginTop: '15px' }}>
              <summary style={{ cursor: 'pointer', color: '#ef4444' }}>Technical Details</summary>
              <pre style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '15px',
                borderRadius: '5px',
                marginTop: '10px',
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {JSON.stringify(errorDetails.error || errorDetails.response, null, 2)}
              </pre>
            </details>
            
            <div style={{ marginTop: '15px' }}>
              <button
                onClick={hideError}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontFamily: "'Space Mono', monospace",
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animation for spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ExistingBusinessPage;
