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

  // Responsive state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive helpers - adjusted for better mobile detection
  const isMobile = windowWidth <= 480; // Covers most mobile devices including iPhone 12 Pro (390px)
  const isTablet = windowWidth <= 1024 && windowWidth > 480;
  const isDesktop = windowWidth > 1024;

  // Common input style for consistent mobile-friendly inputs
  const inputStyle = {
    padding: isMobile ? '12px 14px' : '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#2d3748',
    fontFamily: "'Space Mono', monospace",
    fontSize: isMobile ? '16px' : '14px', // 16px prevents zoom on iOS
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: isMobile ? '44px' : 'auto' // iOS touch target minimum
  };

  // Select style (same as input but with cursor pointer)
  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

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
      addLine('Business Capital', `${parseNumber(formData.business_capital).toLocaleString()} RWF`);
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
      
      // Main results cards
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
      addLine('Success Probability', `${((predictionResult.success_probability || 0) * 100).toFixed(1)}%`);
      yPosition += 5;

      // FACTOR ANALYSIS
      addSectionHeader('DETAILED FACTOR ANALYSIS');
      
      // Financial Factors
      pdf.setTextColor(34, 197, 94);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Financial Factors', 25, yPosition);
      yPosition += 8;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      addLine('Business Capital', 'Strong', 35);
      addLine('Capital Source', 'Medium', 35);
      addLine('Entity Structure', 'Low', 35);
      yPosition += 5;

      // Human Capital
      pdf.setTextColor(59, 130, 246);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Human Capital', 25, yPosition);
      yPosition += 8;
      
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      addLine('Owner Experience', 'High', 35);
      addLine('Education Level', 'Medium', 35);
      addLine('Age Factor', 'Medium', 35);
      yPosition += 10;

      // BUSINESS ANALYTICS DASHBOARD DATA
      checkNewPage();
      addSectionHeader('BUSINESS ANALYTICS DASHBOARD');
      
      // Calculate metrics based on form data (matching frontend logic)
      const capitalScore = formData.business_capital ? 
        Math.min(100, Math.max(30, (parseNumber(formData.business_capital) / 5000000) * 100)) : 45;
      const experienceScore = formData.owner_business_experience ? 
        Math.min(100, Math.max(20, (parseInt(formData.owner_business_experience) / 15) * 100)) : 50;
      const educationScore = formData.education_level_numeric ? 
        Math.min(100, Math.max(30, parseInt(formData.education_level_numeric) * 20)) : 55;
      const finalScore = (predictionResult.success_probability || 0) * 100;

      addLine('Capital Base Score', `${capitalScore.toFixed(0)}%`);
      addLine('Experience Score', `${experienceScore.toFixed(0)}%`);
      addLine('Education Score', `${educationScore.toFixed(0)}%`);
      addLine('Final Prediction Score', `${finalScore.toFixed(0)}%`);
      yPosition += 10;

      // Success Factors Distribution
      addSectionHeader('SUCCESS FACTORS DISTRIBUTION');
      
      const capitalWeight = formData.business_capital ? 
        Math.min(30, Math.max(10, (parseNumber(formData.business_capital) / 5000000) * 30)) : 15;
      const experienceWeight = formData.owner_business_experience ? 
        Math.min(25, Math.max(8, (parseInt(formData.owner_business_experience) / 15) * 25)) : 12;
      const educationWeight = formData.education_level_numeric ? 
        Math.min(20, Math.max(5, parseInt(formData.education_level_numeric) * 4)) : 10;
      const marketWeight = formData.business_sector && formData.business_location ? 18 : 12;
      const structureWeight = formData.entity_type && formData.capital_source ? 15 : 8;
      
      const totalWeight = capitalWeight + experienceWeight + educationWeight + marketWeight + structureWeight;
      
      addLine('Capital Factor', `${((capitalWeight / totalWeight) * 100).toFixed(0)}%`);
      addLine('Experience Factor', `${((experienceWeight / totalWeight) * 100).toFixed(0)}%`);
      addLine('Education Factor', `${((educationWeight / totalWeight) * 100).toFixed(0)}%`);
      addLine('Market Factor', `${((marketWeight / totalWeight) * 100).toFixed(0)}%`);
      addLine('Structure Factor', `${((structureWeight / totalWeight) * 100).toFixed(0)}%`);
      yPosition += 10;

      // SHAP AI-POWERED INSIGHTS
      if (predictionResult.recommendations && predictionResult.recommendations.length > 0) {
        checkNewPage();
        addSectionHeader('SHAP AI-POWERED INSIGHTS');
        addText('Machine learning explanations based on feature importance analysis:');
        yPosition += 5;
        
        predictionResult.recommendations.forEach((rec, index) => {
          addText(`${index + 1}. ${rec}`);
          yPosition += 2;
          checkNewPage();
        });
        
        yPosition += 5;
        addText('SHAP (SHapley Additive exPlanations) analyzes how each business factor contributes to your success prediction. These insights are generated by examining feature importance in the machine learning model, providing data-driven recommendations specific to your business profile.');
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
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #1e40af 100%)',
      color: 'white',
      minHeight: '100vh',
      padding: isMobile ? '8px' : isTablet ? '15px' : '20px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        maxWidth: isMobile ? 'calc(100% - 4px)' : isTablet ? '95%' : '1200px', 
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '40px' }}>
          <h1 style={{
            fontSize: isMobile ? '2rem' : isTablet ? '2.2rem' : '2.5rem',
            marginBottom: '10px',
            color: 'white',
            fontWeight: '800'
          }}>
            Pre-Investment Success Predictor
          </h1>
          <p style={{ 
            fontSize: isMobile ? '1rem' : '1.1rem', 
            opacity: 0.8,
            padding: isMobile ? '0 10px' : '0'
          }}>
            AI-powered analysis for your business idea with personalized recommendations
          </p>
        </div>

        {/* Form Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: isMobile ? '12px' : '20px',
          padding: isMobile ? '16px' : isTablet ? '30px' : '40px',
          marginBottom: isMobile ? '16px' : '30px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          width: '100%',
          boxSizing: 'border-box',
          minWidth: 0,
          overflow: 'hidden'
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
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                gap: isMobile ? '15px' : '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Business Capital (RWF) *
                  </label>
                  <input
                    type="text"
                    name="business_capital"
                    value={formData.business_capital}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 1,200,000"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Number of Employees *
                  </label>
                  <input
                    type="text"
                    name="number_of_employees"
                    value={formData.number_of_employees}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., 5"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Capital Source *
                  </label>
                  <select
                    name="capital_source"
                    value={formData.capital_source}
                    onChange={handleInputChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Select capital source...</option>
                    {capitalSources.map(source => (
                      <option key={source} value={source} style={{ background: '#ffffff', color: '#2d3748' }}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Entity Type *
                  </label>
                  <select
                    name="entity_type"
                    value={formData.entity_type}
                    onChange={handleInputChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Select entity type...</option>
                    {entityTypes.map(type => (
                      <option key={type} value={type} style={{ background: '#ffffff', color: '#2d3748' }}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                gap: isMobile ? '15px' : '20px',
                marginTop: '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Business Sector *
                  </label>
                  <select
                    name="business_sector"
                    value={formData.business_sector}
                    onChange={handleInputChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Select business sector...</option>
                    {businessSectors.map(sector => (
                      <option key={sector} value={sector} style={{ background: '#ffffff', color: '#2d3748' }}>
                        {sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Business Location (District) *
                  </label>
                  <select
                    name="business_location"
                    value={formData.business_location}
                    onChange={handleInputChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Select district...</option>
                    {businessLocations.map(location => (
                      <option key={location} value={location} style={{ background: '#ffffff', color: '#2d3748' }}>
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
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                gap: isMobile ? '15px' : '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
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
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
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
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Owner Gender *
                  </label>
                  <select
                    name="owner_gender"
                    value={formData.owner_gender}
                    onChange={handleInputChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Select gender...</option>
                    <option value="M" style={{ background: '#ffffff', color: '#2d3748' }}>Male</option>
                    <option value="F" style={{ background: '#ffffff', color: '#2d3748' }}>Female</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Education Level *
                  </label>
                  <select
                    name="education_level_numeric"
                    value={formData.education_level_numeric}
                    onChange={handleInputChange}
                    required
                    style={selectStyle}
                  >
                    <option value="">Select education level...</option>
                    {educationLevels.map(level => (
                      <option key={level.value} value={level.value} style={{ background: '#ffffff', color: '#2d3748' }}>
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
                padding: isMobile ? '14px 24px' : '16px 32px',
                borderRadius: '10px',
                fontFamily: "'Space Mono', monospace",
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                width: isMobile ? '100%' : 'auto',
                maxWidth: isMobile ? 'none' : '400px',
                margin: isMobile ? '15px auto' : '20px auto',
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
                'Get Prediction'
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {showResults && predictionResult && predictionResult.success_probability !== undefined && (
          <div
            id="prediction-results"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '40px',
              marginTop: '30px',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              maxWidth: '900px',
              margin: '30px auto 0 auto'
            }}
          >
            {/* Report Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1 style={{
                fontSize: '2rem',
                marginBottom: '20px',
                color: '#1a1a1a',
                fontWeight: '800'
              }}>
                SME Success Prediction Report
              </h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.7, color: '#4a5568' }}>
                Comprehensive AI-powered business analysis with strategic recommendations
              </p>
            </div>

            {/* Main Results Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: isMobile ? '15px' : '20px',
              marginBottom: '40px'
            }}>
              <div style={{
                background: predictionResult.prediction === 'Success' 
                  ? 'rgba(34, 197, 94, 0.2)' 
                  : 'rgba(239, 68, 68, 0.2)',
                border: `2px solid ${predictionResult.prediction === 'Success' ? '#22c55e' : '#ef4444'}`,
                borderRadius: '15px',
                padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
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
                padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '10px' }}>Success Rate</div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#3b82f6'
                }}>
                  {((predictionResult.success_probability || 0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Detailed Factor Analysis */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: isMobile ? '15px' : '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: '#ffffff',
                border: '1px solid #22c55e',
                borderRadius: '15px',
                padding: isMobile ? '15px' : isTablet ? '20px' : '25px'
              }}>
                <h4 style={{ color: '#22c55e', marginBottom: '15px', fontSize: '1.2rem' }}>
                  Financial Factors
                </h4>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#000000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#000000' }}>Business Capital</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>Strong</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#000000' }}>Capital Source</span>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>Medium</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#000000' }}>Entity Structure</span>
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>Low</span>
                  </div>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                border: '1px solid #3b82f6',
                borderRadius: '15px',
                padding: isMobile ? '15px' : isTablet ? '20px' : '25px'
              }}>
                <h4 style={{ color: '#3b82f6', marginBottom: '15px', fontSize: '1.2rem' }}>
                  Human Capital
                </h4>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#000000' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#000000' }}>Owner Experience</span>
                    <span style={{ color: '#22c55e', fontWeight: '600' }}>High</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#000000' }}>Education Level</span>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>Medium</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#000000' }}>Age Factor</span>
                    <span style={{ color: '#fbbf24', fontWeight: '600' }}>Medium</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Analytics Dashboard */}
            <div style={{
              background: '#ffffff',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '30px',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <h3 style={{
                color: '#22c55e',
                marginBottom: '25px',
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                Business Analytics Dashboard
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
                gap: isMobile ? '20px' : '25px'
              }}>
                {/* Success Probability Chart */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: isMobile ? '12px' : isTablet ? '16px' : '20px',
                  overflow: 'hidden'
                }}>
                  <h4 style={{
                    color: '#1f2937',
                    fontSize: '1.1rem',
                    marginBottom: '15px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Success Probability Trend
                  </h4>
                  
                  <div style={{ 
                    position: 'relative', 
                    height: isMobile ? '180px' : isTablet ? '200px' : '220px', 
                    display: 'flex', 
                    alignItems: 'end', 
                    gap: isMobile ? '4px' : isTablet ? '6px' : '8px', 
                    paddingBottom: '20px',
                    paddingTop: '30px',
                    overflow: 'hidden'
                  }}>
                    {/* Dynamic bar chart based on actual form data and predictions */}
                    {(() => {
                      // Calculate real metrics based on form data
                      const capitalScore = formData.business_capital ? 
                        Math.min(100, Math.max(30, (parseInt(parseNumber(formData.business_capital)) / 5000000) * 100)) : 45;
                      
                      const experienceScore = formData.owner_business_experience ? 
                        Math.min(100, Math.max(20, (parseInt(formData.owner_business_experience) / 15) * 100)) : 50;
                      
                      const educationScore = formData.education_level_numeric ? 
                        Math.min(100, Math.max(30, parseInt(formData.education_level_numeric) * 20)) : 55;
                      
                      const finalScore = (predictionResult.success_probability || 0) * 100;
                      
                      const maxHeight = isMobile ? 140 : isTablet ? 150 : 160;
                      
                      return [
                        { label: 'Capital Base', value: capitalScore },
                        { label: 'Experience', value: experienceScore },
                        { label: 'Education', value: educationScore },
                        { label: 'Final Prediction', value: finalScore }
                      ].map((item, index) => (
                        <div key={index} style={{ 
                          flex: 1, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          minWidth: 0,
                          maxWidth: isMobile ? '80px' : isTablet ? '100px' : '120px'
                        }}>
                          <div style={{
                            height: `${(item.value / 100) * maxHeight}px`,
                            background: `linear-gradient(180deg, ${
                              item.value >= 80 ? '#22c55e' : 
                              item.value >= 60 ? '#f59e0b' : 
                              item.value >= 40 ? '#f97316' : '#ef4444'
                            }, ${
                              item.value >= 80 ? '#16a34a' : 
                              item.value >= 60 ? '#d97706' : 
                              item.value >= 40 ? '#ea580c' : '#dc2626'
                            })`,
                            borderRadius: '4px 4px 0 0',
                            width: '100%',
                            maxWidth: isMobile ? '40px' : isTablet ? '50px' : '60px',
                            position: 'relative',
                            transition: 'all 0.8s ease',
                            boxShadow: index === 3 ? '0 4px 12px rgba(34, 197, 94, 0.3)' : '0 2px 6px rgba(0, 0, 0, 0.1)',
                            margin: '0 auto'
                          }}>
                            <div style={{
                              position: 'absolute',
                              top: '-22px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: item.value >= 80 ? '#22c55e' : 
                                         item.value >= 60 ? '#f59e0b' : 
                                         item.value >= 40 ? '#f97316' : '#ef4444',
                              color: 'white',
                              padding: isMobile ? '2px 6px' : isTablet ? '2px 7px' : '3px 8px',
                              borderRadius: '6px',
                              fontSize: isMobile ? '0.65rem' : isTablet ? '0.7rem' : '0.75rem',
                              fontWeight: '700',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.value.toFixed(0)}%
                            </div>
                          </div>
                          <div style={{
                            marginTop: '8px',
                            fontSize: isMobile ? '0.6rem' : isTablet ? '0.65rem' : '0.7rem',
                            color: '#6b7280',
                            textAlign: 'center',
                            lineHeight: '1.2',
                            fontWeight: index === 3 ? '600' : '400',
                            wordBreak: 'break-word',
                            width: '100%',
                            padding: isMobile ? '0 2px' : '0'
                          }}>
                            {item.label}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Success Factors Donut Chart */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: isMobile ? '12px' : isTablet ? '16px' : '20px'
                }}>
                  <h4 style={{
                    color: '#1f2937',
                    fontSize: '1.1rem',
                    marginBottom: '15px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    Success Factors Distribution
                  </h4>
                  
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    {/* Donut Chart */}
                    <div style={{ position: 'relative' }}>
                      <svg 
                        width={isMobile ? "150" : isTablet ? "165" : "180"} 
                        height={isMobile ? "150" : isTablet ? "165" : "180"} 
                        style={{ transform: 'rotate(-90deg)', cursor: 'pointer' }}
                      >
                        {(() => {
                          // Calculate values based on form data
                          const capitalScore = formData.business_capital ? 
                            Math.min(30, Math.max(10, (parseInt(parseNumber(formData.business_capital)) / 5000000) * 30)) : 15;
                          
                          const experienceScore = formData.owner_business_experience ? 
                            Math.min(25, Math.max(8, (parseInt(formData.owner_business_experience) / 15) * 25)) : 12;
                          
                          const educationScore = formData.education_level_numeric ? 
                            Math.min(20, Math.max(5, parseInt(formData.education_level_numeric) * 4)) : 10;
                          
                          const marketScore = formData.business_sector && formData.business_location ? 18 : 12;
                          
                          const structureScore = formData.entity_type && formData.capital_source ? 15 : 8;
                          
                          const total = capitalScore + experienceScore + educationScore + marketScore + structureScore;
                          
                          const sectors = [
                            { name: 'Capital', value: capitalScore, color: '#22c55e' },
                            { name: 'Experience', value: experienceScore, color: '#3b82f6' },
                            { name: 'Education', value: educationScore, color: '#f59e0b' },
                            { name: 'Market', value: marketScore, color: '#8b5cf6' },
                            { name: 'Structure', value: structureScore, color: '#ef4444' }
                          ];
                          
                          let currentAngle = 0;
                          const chartSize = isMobile ? 150 : isTablet ? 165 : 180;
                          const radius = chartSize * 0.39;
                          const innerRadius = chartSize * 0.25;
                          const centerX = chartSize / 2;
                          const centerY = chartSize / 2;
                          
                          return (
                            <>
                              {sectors.map((sector, index) => {
                                const angle = (sector.value / total) * 360;
                                const startAngle = currentAngle;
                                const endAngle = currentAngle + angle;
                                
                                const startAngleRad = (startAngle * Math.PI) / 180;
                                const endAngleRad = (endAngle * Math.PI) / 180;
                                
                                const largeArcFlag = angle > 180 ? 1 : 0;
                                
                                const outerStartX = centerX + radius * Math.cos(startAngleRad);
                                const outerStartY = centerY + radius * Math.sin(startAngleRad);
                                const outerEndX = centerX + radius * Math.cos(endAngleRad);
                                const outerEndY = centerY + radius * Math.sin(endAngleRad);
                                
                                const innerStartX = centerX + innerRadius * Math.cos(startAngleRad);
                                const innerStartY = centerY + innerRadius * Math.sin(startAngleRad);
                                const innerEndX = centerX + innerRadius * Math.cos(endAngleRad);
                                const innerEndY = centerY + innerRadius * Math.sin(endAngleRad);
                                
                                const pathData = [
                                  `M ${outerStartX} ${outerStartY}`,
                                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
                                  `L ${innerEndX} ${innerEndY}`,
                                  `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
                                  'Z'
                                ].join(' ');
                                
                                currentAngle += angle;
                                
                                return (
                                  <path
                                    key={index}
                                    d={pathData}
                                    fill={sector.color}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                    style={{
                                      filter: `drop-shadow(0 2px 4px ${sector.color}40)`,
                                      transition: 'all 0.3s ease',
                                      cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => {
                                      e.target.style.filter = `drop-shadow(0 4px 8px ${sector.color}60)`;
                                      e.target.style.transform = 'scale(1.05)';
                                      e.target.style.transformOrigin = '90px 90px';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.target.style.filter = `drop-shadow(0 2px 4px ${sector.color}40)`;
                                      e.target.style.transform = 'scale(1)';
                                    }}
                                  />
                                );
                              })}
                            </>
                          );
                        })()}
                      </svg>
                      
                      {/* Center Text */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: isMobile ? '1.4rem' : isTablet ? '1.6rem' : '1.8rem',
                          fontWeight: '700',
                          color: (predictionResult.success_probability || 0) >= 0.7 ? '#22c55e' : 
                                 (predictionResult.success_probability || 0) >= 0.5 ? '#f59e0b' : '#ef4444'
                        }}>
                          {((predictionResult.success_probability || 0) * 100).toFixed(0)}%
                        </div>
                        <div style={{
                          fontSize: isMobile ? '0.6rem' : '0.7rem',
                          color: '#6b7280',
                          fontWeight: '500'
                        }}>
                          Success Rate
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 
                                         isTablet ? 'repeat(3, 1fr)' : 
                                         'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: isMobile ? '6px' : '8px',
                      width: '100%'
                    }}>
                      {(() => {
                        const capitalScore = formData.business_capital ? 
                          Math.min(30, Math.max(10, (parseInt(parseNumber(formData.business_capital)) / 5000000) * 30)) : 15;
                        
                        const experienceScore = formData.owner_business_experience ? 
                          Math.min(25, Math.max(8, (parseInt(formData.owner_business_experience) / 15) * 25)) : 12;
                        
                        const educationScore = formData.education_level_numeric ? 
                          Math.min(20, Math.max(5, parseInt(formData.education_level_numeric) * 4)) : 10;
                        
                        const marketScore = formData.business_sector && formData.business_location ? 18 : 12;
                        
                        const structureScore = formData.entity_type && formData.capital_source ? 15 : 8;
                        
                        const total = capitalScore + experienceScore + educationScore + marketScore + structureScore;
                        
                        const sectors = [
                          { name: 'Capital', value: capitalScore, color: '#22c55e' },
                          { name: 'Experience', value: experienceScore, color: '#3b82f6' },
                          { name: 'Education', value: educationScore, color: '#f59e0b' },
                          { name: 'Market', value: marketScore, color: '#8b5cf6' },
                          { name: 'Structure', value: structureScore, color: '#ef4444' }
                        ];
                        
                        return sectors.map((sector, index) => (
                          <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: sector.color,
                              borderRadius: '50%',
                              flexShrink: 0
                            }}></div>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#374151',
                              fontWeight: '500'
                            }}>
                              {sector.name}
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              color: sector.color,
                              fontWeight: '600'
                            }}>
                              {((sector.value / total) * 100).toFixed(0)}%
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Assessment */}
            <div style={{
              background: '#ffffff',
              borderRadius: '15px',
              padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
              marginBottom: '30px',
              border: '1px solid rgba(34, 197, 94, 0.3)'
            }}>
              <h3 style={{
                color: '#22c55e',
                marginBottom: '15px',
                fontSize: '1.5rem'
              }}>
                Overall Assessment
              </h3>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '15px', color: '#000000' }}>
                {(predictionResult.success_probability || 0) >= 0.6 
                  ? 'Excellent business potential with high success probability.'
                  : (predictionResult.success_probability || 0) >= 0.4
                  ? 'Business shows moderate potential with some strategic improvements needed.'
                  : 'Business faces significant challenges but can be improved with proper planning and strategic changes.'}
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: isMobile ? '10px' : '15px',
                marginTop: '20px'
              }}>
                <div style={{
                  background: '#ffffff',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid #22c55e'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#000000' }}>Strengths</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c55e' }}>
                    {getAssessmentText(predictionResult.strengths?.length || 2, 'strengths')}
                  </div>
                </div>
                
                <div style={{
                  background: '#ffffff',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid #fbbf24'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#000000' }}>Opportunities</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fbbf24' }}>
                    {getAssessmentText(predictionResult.opportunities?.length || 3, 'opportunities')}
                  </div>
                </div>

                <div style={{
                  background: '#ffffff',
                  padding: '15px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid #3b82f6'
                }}>
                  <div style={{ fontSize: '0.9rem', color: '#000000' }}>Success Rate</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 
                    (predictionResult.success_probability || 0) >= 0.7 ? '#22c55e' : 
                    (predictionResult.success_probability || 0) >= 0.5 ? '#f59e0b' : '#ef4444' }}>
                    {((predictionResult.success_probability || 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* SHAP-Based AI Recommendations */}
            {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                border: '3px solid #3b82f6',
                boxShadow: '0 15px 40px rgba(59, 130, 246, 0.25)',
                overflow: 'hidden',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '25px',
                  paddingBottom: '15px',
                  borderBottom: '2px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    borderRadius: '12px',
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                  }}>
                    AI
                  </div>
                  <div>
                    <h3 style={{
                      color: '#1f2937',
                      fontSize: '1.7rem',
                      fontWeight: '700',
                      margin: '0',
                      background: 'linear-gradient(135deg, #1f2937, #3b82f6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      SHAP AI-Powered Insights
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      margin: '5px 0 0 0',
                      fontWeight: '500'
                    }}>
                      Machine learning explanations based on feature importance analysis
                    </p>
                  </div>
                </div>
                
                {/* Simple recommendations display */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '20px',
                  fontSize: '1rem',
                  lineHeight: '1.6',
                  color: '#1f2937'
                }}>
                  {predictionResult.recommendations.map((recommendation, index) => (
                    <div key={index} style={{ marginBottom: index < predictionResult.recommendations.length - 1 ? '15px' : '0' }}>
                      {recommendation}
                    </div>
                  ))}
                </div>
                
                {/* SHAP Explanation Footer */}
                <div style={{
                  marginTop: '25px',
                  padding: '20px',
                  background: 'rgba(59, 130, 246, 0.05)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#4b5563',
                    margin: '0',
                    fontStyle: 'italic',
                    lineHeight: '1.5'
                  }}>
                    <strong>SHAP (SHapley Additive exPlanations)</strong> analyzes how each business factor contributes to your success prediction. 
                    These insights are generated by examining feature importance in the machine learning model, providing 
                    data-driven recommendations specific to your business profile.
                  </p>
                </div>
              </div>
            )}
            <div style={{
              background: 'rgba(255, 193, 7, 0.15)',
              border: '2px solid #ffc107',
              borderRadius: '12px',
              padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
              marginTop: '30px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(255, 193, 7, 0.2)'
            }}>
              <h4 style={{ 
                color: '#f59e0b', 
                marginBottom: '15px',
                fontSize: '1.2rem',
                fontWeight: '700',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}>
                Important Disclaimer
              </h4>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.6',
                margin: '0 0 15px 0',
                color: '#1f2937',
                fontWeight: '500'
              }}>
                This AI prediction is for informational purposes only and should not be considered as professional business advice. 
                Results are based on statistical patterns and may not account for all factors affecting business success.
              </p>
              <p style={{ 
                fontSize: '1rem', 
                lineHeight: '1.6',
                margin: '0',
                color: '#1f2937',
                fontWeight: '600'
              }}>
                <strong>Please consult with professional business consultants, financial advisors, or industry experts before making important business decisions.</strong>
              </p>
            </div>

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
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #5a6fd8, #6a4c93)';
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.4)';
                }}
              >
                Analyze Another Idea
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