import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// API Configuration - TEMPORARY: Force deployed API
// TODO: Uncomment the dynamic detection once local development is confirmed working
const API_BASE_URL = 'https://smes-predictor-final.onrender.com';

// Dynamic detection (currently disabled for debugging)
/*
const API_BASE_URL = (() => {
  // Check if we're explicitly running in local development
  const isLocalDev = window.location.hostname === 'localhost' && 
                    window.location.port === '3000';
  
  // Always use deployed API unless we're sure we're in local development
  const apiUrl = isLocalDev ? 'http://localhost:8000' : 'https://smes-predictor-final.onrender.com';
  
  console.log('Environment check:');
  console.log('- Hostname:', window.location.hostname);
  console.log('- Port:', window.location.port);
  console.log('- Full URL:', window.location.href);
  console.log('- Is Local Dev:', isLocalDev);
  console.log('- Using API:', apiUrl);
  
  return apiUrl;
})();
*/

console.log('Using API Base URL:', API_BASE_URL);

const ExistingBusinessPage = () => {
  const [formData, setFormData] = useState({
    business_capital: '',
    business_sector: '',
    entity_type: '',
    business_location: '',
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
      capital_source: '', turnover_first_year: '',
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

      // PERFORMANCE HISTORY
      addSectionHeader('4-YEAR PERFORMANCE HISTORY');
      
      // Revenue
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Revenue Performance (RWF):', 25, yPosition);
      yPosition += 8;
      
      ['first', 'second', 'third', 'fourth'].forEach((year, index) => {
        const value = parseInt(formData[`turnover_${year}_year`] || 0).toLocaleString();
        addLine(`Year ${index + 1}`, value, 30);
      });
      yPosition += 5;

      // Employment
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Employment History:', 25, yPosition);
      yPosition += 8;
      
      ['first', 'second', 'third', 'fourth'].forEach((year, index) => {
        const value = `${parseInt(formData[`employment_${year}_year`] || 0)} employees`;
        addLine(`Year ${index + 1}`, value, 30);
      });

      // PREDICTION RESULTS
      checkNewPage();
      addSectionHeader('PREDICTION RESULTS');
      
      // Main result with color
      const isSuccess = predictionResult.prediction === 'Success';
      pdf.setTextColor(isSuccess ? 0 : 200, isSuccess ? 150 : 0, 0);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Prediction: ${predictionResult.prediction}`, pageWidth/2, yPosition, { align: 'center' });
      yPosition += 15;
      
      pdf.setTextColor(0, 0, 0);
      addLine('Success Probability', `${(predictionResult.success_probability * 100).toFixed(1)}%`);
      addLine('Model Confidence', `${(predictionResult.confidence * 100).toFixed(1)}%`);

      // BUSINESS INSIGHTS
      if (predictionResult.business_insights) {
        addSectionHeader('BUSINESS INSIGHTS');
        const insights = predictionResult.business_insights;
        
        if (insights.employment_growth) {
          addLine('Employment Growth', insights.employment_growth);
        }
        if (insights.business_scaling) {
          addLine('Business Scaling', insights.business_scaling);
        }
        if (insights.employment_efficiency) {
          addLine('Employment Efficiency', insights.employment_efficiency.toFixed(2));
        }
        if (insights.capital_efficiency) {
          addLine('Capital Efficiency', insights.capital_efficiency.toFixed(2));
        }
      }

      // RECOMMENDATIONS
      if (predictionResult.recommendations && predictionResult.recommendations.length > 0) {
        checkNewPage();
        addSectionHeader('RECOMMENDATIONS');
        predictionResult.recommendations.forEach((rec, index) => {
          addText(`${index + 1}. ${rec}`);
          yPosition += 2;
        });
      }

      // RISK FACTORS
      if (predictionResult.risk_factors && predictionResult.risk_factors.length > 0) {
        checkNewPage();
        addSectionHeader('RISK FACTORS');
        predictionResult.risk_factors.forEach((risk) => {
          addText(`• ${risk}`);
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
      pdf.text('SME Predictor v1.1', 20, pageHeight - 10);

      // Download
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `SME-Report-${timestamp}.pdf`;
      
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
        business_capital: parseFloat(formData.business_capital),
        business_sector: formData.business_sector,
        entity_type: formData.entity_type,
        business_location: formData.business_location,
        capital_source: formData.capital_source,
        turnover_first_year: parseFloat(formData.turnover_first_year) || 0,
        turnover_second_year: parseFloat(formData.turnover_second_year) || 0,
        turnover_third_year: parseFloat(formData.turnover_third_year) || 0,
        turnover_fourth_year: parseFloat(formData.turnover_fourth_year) || 0,
        employment_first_year: parseInt(formData.employment_first_year) || 0,
        employment_second_year: parseInt(formData.employment_second_year) || 0,
        employment_third_year: parseInt(formData.employment_third_year) || 0,
        employment_fourth_year: parseInt(formData.employment_fourth_year) || 0
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

      // Show results if we have prediction data, regardless of success status
      if (response.data.prediction && response.data.success_probability !== undefined) {
        const successMessage = response.data.success ? 'Prediction completed successfully!' : 'Prediction completed with warnings';
        toast.success(successMessage);
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
        
        // Check if we're trying to connect to localhost while not running locally
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1';
        
        if (!isLocalhost && API_BASE_URL.includes('localhost')) {
          errorMessage = 'Local API server not accessible. Switching to deployed API...';
        } else if (API_BASE_URL.includes('onrender.com')) {
          errorMessage = 'Cannot connect to deployed API server. The server might be starting up (this can take a few minutes for free tier services) or experiencing issues.';
        } else {
          errorMessage = 'Cannot connect to API server. Please check your internet connection and try again.';
        }
        
        errorData = { request: error.request, code: error.code, apiUrl: API_BASE_URL };
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
                      {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Year Employees
                    </label>
                    <input
                      type="number"
                      name={`employment_${year}_year`}
                      value={formData[`employment_${year}_year`]}
                      onChange={handleInputChange}
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
                    SME Predictor 1.1
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

            {/* Disclaimer Message */}
            <div style={{
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '10px',
              padding: '20px',
              marginTop: '30px',
              textAlign: 'center'
            }}>
              <h4 style={{ 
                color: '#ffc107', 
                marginBottom: '15px',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}>
                Important Disclaimer
              </h4>
              <p style={{ 
                fontSize: '0.9rem', 
                lineHeight: '1.6',
                margin: '0 0 10px 0',
                opacity: 0.9
              }}>
                This AI prediction is for informational purposes only and should not be considered as professional business advice. 
                Results are based on statistical patterns and may not account for all factors affecting business success.
              </p>
              <p style={{ 
                fontSize: '0.9rem', 
                lineHeight: '1.6',
                margin: '0',
                opacity: 0.9
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

export default ExistingBusinessPage;
