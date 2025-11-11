import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

// API Configuration - Local priority with automatic fallback
const API_CONFIG = {
  LOCAL_URL: 'http://localhost:8000',
  DEPLOYED_URL: 'https://smes-predictor-final.onrender.com',
  
  // Get the best available API URL
  getApiUrl: async () => {
    // First try local API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second timeout
      
      const response = await fetch(`${API_CONFIG.LOCAL_URL}/docs`, { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Using Local API:', API_CONFIG.LOCAL_URL);
        return API_CONFIG.LOCAL_URL;
      }
    } catch (error) {
      // Local API not available, use deployed
    }
    
    console.log('🌐 Using Deployed API:', API_CONFIG.DEPLOYED_URL);
    return API_CONFIG.DEPLOYED_URL;
  }
};


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
  const [predictionResult, setPredictionResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const capitalSources = [
    'Personal Savings', 'Bank Loan', 'Business Partner', 'Microfinance',
    'Family/Friends', 'Government Grant', 'Foreign Investment', 
    'Venture Capital', 'Crowdfunding', 'Inheritance', 'Business Incubator', 'Angel Investment'
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

  const educationLevels = [
    { value: 0, label: '0 - No formal education' },
    { value: 1, label: '1 - Primary education' },
    { value: 2, label: '2 - Secondary education' },
    { value: 3, label: '3 - Tertiary education' },
    { value: 4, label: '4 - Higher education' }
  ];

  // Format number with thousand separators
  const formatNumber = (value) => {
    if (!value) return '';
    // Remove all non-digits
    const numericValue = value.replace(/\D/g, '');
    // Add thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Remove formatting to get raw number
  const parseNumber = (value) => {
    return value.replace(/,/g, '');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Check if this is a numeric field that needs formatting
    const numericFields = ['business_capital', 'number_of_employees'];
    
    if (numericFields.includes(name)) {
      // Format the number with commas for display
      const formattedValue = formatNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Helper function to convert numeric assessment counts to descriptive words
  const getAssessmentText = (count, type) => {
    const assessmentLevels = {
      strengths: {
        1: 'Limited',
        2: 'Moderate', 
        3: 'Strong',
        4: 'Excellent',
        5: 'Outstanding'
      },
      opportunities: {
        1: 'Few',
        2: 'Some',
        3: 'Several',
        4: 'Many',
        5: 'Abundant'
      },
      risks: {
        1: 'Minimal',
        2: 'Low',
        3: 'Moderate',
        4: 'High',
        5: 'Critical'
      }
    };
    
    return assessmentLevels[type]?.[count] || assessmentLevels[type]?.[3] || 'Moderate';
  };

  const resetForm = () => {
    setFormData({
      business_capital: '', owner_age: '', owner_business_experience: '',
      capital_source: '', business_sector: '', number_of_employees: '',
      business_location: '', entity_type: '', owner_gender: '', education_level_numeric: ''
    });
    setPredictionResult(null);
    setShowResults(false);
    setErrorDetails(null);
    setShowError(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadPDF = async () => {
    try {
      toast.loading('Generating PDF report...', { id: 'pdf-generation' });
      
      if (!predictionResult) {
        toast.error('No prediction results to download');
        return;
      }

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Simple helper functions
      const addTitle = (text, size = 16, color = [0, 0, 0]) => {
        pdf.setTextColor(...color);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, pageWidth/2, yPosition, { align: 'center' });
        yPosition += size * 0.6;
      };

      const addSubtitle = (text, size = 12) => {
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(size);
        pdf.setFont('helvetica', 'normal');
        pdf.text(text, pageWidth/2, yPosition, { align: 'center' });
        yPosition += size * 0.6;
      };

      const addSectionHeader = (text) => {
        yPosition += 10;
        pdf.setFillColor(240, 240, 240);
        pdf.rect(20, yPosition - 5, pageWidth - 40, 12, 'F');
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(text, 25, yPosition + 2);
        yPosition += 15;
      };

      const addLine = (label, value, indent = 25) => {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${label}:`, indent, yPosition);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value, indent + 60, yPosition);
        yPosition += 6;
      };

      const addText = (text, indent = 25) => {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const lines = pdf.splitTextToSize(text, pageWidth - 50);
        lines.forEach((line, index) => {
          pdf.text(line, indent, yPosition + (index * 5));
        });
        yPosition += lines.length * 5 + 3;
      };

      const checkNewPage = () => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
      };

      // HEADER
      addTitle('SME SUCCESS PREDICTION REPORT');
      addSubtitle('Professional Business Analysis');
      addSubtitle(`Generated: ${new Date().toLocaleDateString()}`);
      yPosition += 10;

      // BUSINESS INFORMATION
      addSectionHeader('BUSINESS INFORMATION');
      addLine('Business Capital', `${parseInt(formData.business_capital).toLocaleString()} RWF`);
      addLine('Business Sector', formData.business_sector);
      addLine('Entity Type', formData.entity_type);
      addLine('Location', formData.business_location);
      addLine('Capital Source', formData.capital_source);
      addLine('Number of Employees', formData.number_of_employees);
      
      // OWNER INFORMATION
      addSectionHeader('OWNER INFORMATION');
      addLine('Owner Age', formData.owner_age);
      addLine('Business Experience', `${formData.owner_business_experience} years`);
      addLine('Gender', formData.owner_gender);
      addLine('Education Level', educationLevels.find(e => e.value == formData.education_level_numeric)?.label || 'Not specified');

      // PREDICTION RESULTS
      checkNewPage();
      addSectionHeader('PREDICTION RESULTS');
      
      // Main result with color
      const isSuccess = predictionResult.prediction === 'Success';
      pdf.setTextColor(isSuccess ? 0 : 200, isSuccess ? 150 : 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      const businessSuccessText = predictionResult.prediction === 'Success' ? 'High Potential' : 
                                 predictionResult.prediction === 'Moderate Success' ? 'Moderate Potential' : 
                                 'Needs Improvement';
      pdf.text(`Business Success: ${businessSuccessText}`, pageWidth/2, yPosition, { align: 'center' });
      yPosition += 15;
      
      pdf.setTextColor(0, 0, 0);
      addLine('Success Probability', `${(predictionResult.success_probability * 100).toFixed(1)}%`);
      addLine('Risk Level', predictionResult.risk_level || 'Medium Risk');
      addLine('Model Version', 'SME Predictor 1.0');

      // RECOMMENDATIONS
      if (predictionResult.recommendations && predictionResult.recommendations.length > 0) {
        checkNewPage();
        addSectionHeader('RECOMMENDATIONS');
        predictionResult.recommendations.forEach((rec, index) => {
          addText(`${index + 1}. ${rec}`);
          yPosition += 2;
        });
      }

      // DISCLAIMER
      checkNewPage();
      addSectionHeader('DISCLAIMER');
      addText('This AI prediction is for informational purposes only and should not be considered as professional business advice. Results are based on statistical patterns and may not account for all factors affecting business success. Please consult with professional advisors before making important business decisions.');

      // FOOTER
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${pdf.internal.getNumberOfPages()}`, pageWidth - 30, pageHeight - 10);
      pdf.text('SME Predictor v1.0', 20, pageHeight - 10);

      // Download
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `SME-PreInvestment-Report-${timestamp}.pdf`;
      
      pdf.save(filename);
      toast.success('PDF report downloaded successfully!', { id: 'pdf-generation' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report', { id: 'pdf-generation' });
    }
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
        ...formData,
        business_capital: parseInt(parseNumber(formData.business_capital)),
        owner_age: parseInt(formData.owner_age),
        owner_business_experience: parseInt(formData.owner_business_experience),
        number_of_employees: parseInt(parseNumber(formData.number_of_employees)),
        education_level_numeric: parseInt(formData.education_level_numeric)
      };

      console.log('Sending data to API:', processedData);
      
      // Get the best available API URL (checks local first)
      const apiUrl = await API_CONFIG.getApiUrl();
      
      try {
        // Try the selected API
        const response = await axios.post(`${apiUrl}/predict`, processedData, {
          timeout: 30000 // 30 second timeout for Render cold starts
        });
        
        console.log('API Response:', response.data);
        
        // Check if response has prediction data (even if success is false)
        if (response.data && response.data.prediction) {
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
      } catch (apiError) {
        // If the primary API failed and it was local, try deployed as fallback
        if (apiUrl === API_CONFIG.LOCAL_URL) {
          console.log('🔄 Local API failed, trying deployed API...');
          toast.loading('Switching to deployed API...', { id: 'api-fallback' });
          
          try {
            const response = await axios.post(`${API_CONFIG.DEPLOYED_URL}/predict`, processedData, {
              timeout: 30000
            });
            
            console.log('Deployed API Response:', response.data);
            
            // Check if response has prediction data (even if success is false)
            if (response.data && response.data.prediction) {
              toast.success('Prediction completed successfully!', { id: 'api-fallback' });
              setPredictionResult(response.data);
              setShowResults(true);
              setTimeout(() => {
                const resultsElement = document.getElementById('prediction-results');
                if (resultsElement) {
                  resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 100);
              return; // Exit successfully
            }
          } catch (fallbackError) {
            // Both APIs failed, throw the original error
            throw apiError;
          }
        }
        
        // If deployed API failed or no fallback available, throw error
        throw apiError;
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
        errorMessage = 'Cannot connect to API server. Please check your internet connection and try again. The server might be starting up if using deployed API.';
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
            Pre-Investment Success Predictor
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
            AI-powered analysis for your business idea with personalized recommendations
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
                Business Information
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
                    type="text"
                    name="business_capital"
                    value={formData.business_capital}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1,200,000"
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
                    type="text"
                    name="number_of_employees"
                    value={formData.number_of_employees}
                    onChange={handleInputChange}
                    required
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

            {/* Owner Information Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{
                color: '#22c55e',
                marginBottom: '20px',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                Owner Information
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Owner Age *
                  </label>
                  <input
                    type="number"
                    name="owner_age"
                    value={formData.owner_age}
                    onChange={handleInputChange}
                    required
                    min="18"
                    max="80"
                    placeholder="e.g., 35"
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
                    Business Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="owner_business_experience"
                    value={formData.owner_business_experience}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="50"
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
                    Owner Gender *
                  </label>
                  <select
                    name="owner_gender"
                    value={formData.owner_gender}
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
                    <option value="">Select gender...</option>
                    <option value="M" style={{ background: '#1e293b', color: 'white' }}>Male</option>
                    <option value="F" style={{ background: '#1e293b', color: 'white' }}>Female</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#e2e8f0' }}>
                    Education Level *
                  </label>
                  <select
                    name="education_level_numeric"
                    value={formData.education_level_numeric}
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
                    <option value="">Select education level...</option>
                    {educationLevels.map(level => (
                      <option key={level.value} value={level.value} style={{ background: '#1e293b', color: 'white' }}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
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
                  Analyzing your business idea...
                </span>
              ) : (
                'Get Success Prediction & Recommendations'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {showResults && predictionResult && (
          <div
            id="prediction-results"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              marginTop: '30px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Report Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '2.5rem',
                marginBottom: '10px',
                background: 'linear-gradient(45deg, #22c55e, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                SME Success Prediction Report
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                Comprehensive AI-powered business analysis with strategic recommendations
              </p>
            </div>

            {/* Main Results Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '40px'
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
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Business Success</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: predictionResult.prediction === 'Success' ? '#22c55e' : '#ef4444'
                }}>
                  {predictionResult.prediction === 'Success' ? 'High Potential' : predictionResult.prediction === 'Moderate Success' ? 'Moderate Potential' : 'Needs Improvement'}
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '2px solid #3b82f6',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Success Rate</div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#3b82f6'
                }}>
                  {(predictionResult.success_probability * 100).toFixed(1)}%
                </div>
              </div>

              <div style={{
                background: predictionResult.risk_level === 'Low Risk' 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : predictionResult.risk_level === 'Medium Risk'
                  ? 'rgba(251, 191, 36, 0.2)'
                  : 'rgba(239, 68, 68, 0.2)',
                border: `2px solid ${
                  predictionResult.risk_level === 'Low Risk' 
                    ? '#22c55e' 
                    : predictionResult.risk_level === 'Medium Risk'
                    ? '#fbbf24'
                    : '#ef4444'
                }`,
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Risk Assessment</div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: predictionResult.risk_level === 'Low Risk' 
                    ? '#22c55e' 
                    : predictionResult.risk_level === 'Medium Risk'
                    ? '#fbbf24'
                    : '#ef4444'
                }}>
                  {predictionResult.risk_level || 'Medium Risk'}
                </div>
              </div>

              <div style={{
                background: 'rgba(147, 51, 234, 0.2)',
                border: '2px solid #9333ea',
                borderRadius: '15px',
                padding: '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Model Version</div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  color: '#9333ea'
                }}>
                  SME Predictor 1.0
                </div>
              </div>
            </div>

            {/* Factor Analysis Section */}
            {predictionResult.feature_importance && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '30px',
                marginBottom: '30px'
              }}>
                <h3 style={{
                  color: '#22c55e',
                  marginBottom: '25px',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  Factor Analysis
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px'
                }}>
                  {Object.entries(predictionResult.feature_importance)
                    .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                    .slice(0, 8)
                    .map(([feature, importance]) => (
                    <div key={feature} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      padding: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                          {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span style={{
                          fontSize: '0.8rem',
                          color: importance > 0 ? '#22c55e' : '#ef4444'
                        }}>
                          {importance > 0 ? '+' : ''}{(importance * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div style={{
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.abs(importance) * 100}%`,
                          background: importance > 0 
                            ? 'linear-gradient(45deg, #22c55e, #10b981)'
                            : 'linear-gradient(45deg, #ef4444, #dc2626)',
                          borderRadius: '3px'
                        }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Factor Analysis */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid #22c55e',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h4 style={{ color: '#22c55e', marginBottom: '15px', fontSize: '1.2rem' }}>
                  Financial Factors
                </h4>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Business Capital</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>Strong</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Capital Source</span>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>Medium</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Entity Structure</span>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>Low</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h4 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '1.2rem' }}>
                  Human Capital
                </h4>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Owner Experience</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>High</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Education Level</span>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>Medium</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Age Factor</span>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>Medium</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid #a855f7',
                borderRadius: '15px',
                padding: '25px'
              }}>
                <h4 style={{ color: '#a855f7', marginBottom: '15px', fontSize: '1.2rem' }}>
                  Market Factors
                </h4>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Business Sector</span>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>Low</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Location</span>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>Low</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Team Size</span>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>Low</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Assessment */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '15px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <h3 style={{
                color: '#22c55e',
                marginBottom: '15px',
                fontSize: '1.5rem'
              }}>
                Overall Assessment
              </h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '15px' }}>
                {predictionResult.prediction === 'Success' 
                  ? 'Excellent business potential with high success probability.'
                  : 'Business shows potential but requires strategic improvements.'}
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginTop: '20px'
              }}>
                <div style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Strengths</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c55e' }}>
                    {getAssessmentText(predictionResult.strengths?.length || 2, 'strengths')}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(251, 191, 36, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Opportunities</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fbbf24' }}>
                    {getAssessmentText(predictionResult.opportunities?.length || 3, 'opportunities')}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Risk Areas</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ef4444' }}>
                    {getAssessmentText(predictionResult.risks?.length || 2, 'risks')}
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Recommendations */}
            {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '15px',
                padding: '25px',
                marginBottom: '30px'
              }}>
                <h3 style={{
                  color: '#22c55e',
                  marginBottom: '20px',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  Strategic Recommendations
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '15px'
                }}>
                  {predictionResult.recommendations.map((rec, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '10px',
                      padding: '20px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: '#22c55e',
                        color: 'white',
                        borderRadius: '50%',
                        width: '25px',
                        height: '25px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: '700'
                      }}>
                        {index + 1}
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        paddingRight: '35px'
                      }}>
                        {rec}
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
                Analyze Another Idea
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
                onClick={downloadPDF}
                style={{
                  background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontFamily: "'Space Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Download Report
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

export default PreInvestmentPage;