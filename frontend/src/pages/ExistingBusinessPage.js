import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaChartLine, FaLightbulb, FaShieldAlt } from 'react-icons/fa';
import FeedbackForm from '../components/FeedbackForm';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

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
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  // Responsive design helpers - adjusted for better mobile detection
  const isMobile = windowWidth <= 480; // Covers most mobile devices including iPhone 12 Pro (390px)
  const isTablet = windowWidth <= 1024 && windowWidth > 480;
  const isDesktop = windowWidth > 1024;

  // Handle window resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chart data generation functions
  const generateFactorAnalysisData = (predictionResult, formData) => {
    // Calculate factor importance based on actual business features
    const capitalAmount = parseFloat(parseNumber(formData.business_capital)) || 0;
    const avgTurnover = [
      parseFloat(parseNumber(formData.turnover_first_year)) || 0,
      parseFloat(parseNumber(formData.turnover_second_year)) || 0,
      parseFloat(parseNumber(formData.turnover_third_year)) || 0,
      parseFloat(parseNumber(formData.turnover_fourth_year)) || 0
    ].reduce((a, b) => a + b, 0) / 4;
    
    const avgEmployment = [
      parseInt(parseNumber(formData.employment_first_year)) || 0,
      parseInt(parseNumber(formData.employment_second_year)) || 0,
      parseInt(parseNumber(formData.employment_third_year)) || 0,
      parseInt(parseNumber(formData.employment_fourth_year)) || 0
    ].reduce((a, b) => a + b, 0) / 4;

    const factors = [
      {
        name: 'Business Capital',
        impact: Math.min((capitalAmount / 5000000) * 20, 25) + 5 // Scale capital impact
      },
      {
        name: 'Revenue Performance',
        impact: Math.min((avgTurnover / 10000000) * 18, 22) + 3 // Scale revenue impact
      },
      {
        name: 'Employment Growth',
        impact: Math.min((avgEmployment / 20) * 15, 18) + 2 // Scale employment impact
      },
      {
        name: 'Business Sector',
        impact: formData.business_sector === 'Information And Communication' ? 16 :
                formData.business_sector === 'Financial And Insurance Activities' ? 14 :
                formData.business_sector === 'Manufacturing' ? 12 : 
                Math.random() * 8 + 6 // Higher impact for tech/finance sectors
      },
      {
        name: 'Capital Source',
        impact: formData.capital_source === 'Bank Loan' ? 12 :
                formData.capital_source === 'Government Grant' ? 14 :
                formData.capital_source === 'Personal Savings' ? 10 :
                formData.capital_source === 'Venture Capital' ? 16 :
                Math.random() * 6 + 7 // Different impacts for funding sources
      },
      {
        name: 'Business Location',
        impact: formData.business_location === 'GASABO' ? 14 :
                formData.business_location === 'KICUKIRO' ? 13 :
                formData.business_location === 'NYARUGENGE' ? 15 :
                Math.random() * 8 + 5 // Higher impact for Kigali districts
      },
      {
        name: 'Entity Type',
        impact: formData.entity_type === 'LIMITED LIABILITY COMPANY' ? 12 :
                formData.entity_type === 'PRIVATE CORPORATION' ? 14 :
                formData.entity_type === 'INDIVIDUAL' ? 6 :
                Math.random() * 5 + 4 // Higher impact for formal structures
      }
    ];

    // Sort by impact for better visualization
    factors.sort((a, b) => b.impact - a.impact);

    return {
      labels: factors.map(f => f.name),
      datasets: [{
        label: 'Impact on Success',
        data: factors.map(f => f.impact),
        backgroundColor: [
          '#3b82f6',
          '#1e40af',
          '#60a5fa',
          '#1d4ed8',
          '#2563eb',
          '#93c5fd',
          '#1e3a8a'
        ],
        borderColor: '#1e40af',
        borderWidth: 1
      }]
    };
  };

  const generateSuccessDistributionData = (predictionResult) => {
    const successProb = predictionResult.success_probability * 100;
    
    // Create gauge data for semi-circle display
    const gaugeData = [
      { label: 'High Risk', value: 25, color: '#ef4444' },
      { label: 'Moderate Risk', value: 25, color: '#f97316' }, 
      { label: 'Low Risk', value: 25, color: '#eab308' },
      { label: 'Success Zone', value: 25, color: '#22c55e' }
    ];

    return {
      labels: gaugeData.map(d => d.label),
      datasets: [{
        data: gaugeData.map(d => d.value),
        backgroundColor: gaugeData.map(d => d.color),
        borderWidth: 2,
        borderColor: '#ffffff',
        cutout: '75%',
        circumference: 180,
        rotation: 270,
        needleValue: successProb
      }]
    };
  };

  // Enhanced recommendation formatter
  const formatRecommendation = (rec, index) => {
    const recommendationTypes = {
      'revenue': { icon: '📈', color: '#10b981', title: 'Revenue Growth Strategy' },
      'employment': { icon: '👥', color: '#3b82f6', title: 'Employment Optimization' },
      'capital': { icon: '💰', color: '#f59e0b', title: 'Capital Management' },
      'market': { icon: '🎯', color: '#8b5cf6', title: 'Market Strategy' },
      'operational': { icon: '⚙️', color: '#ef4444', title: 'Operational Excellence' },
      'financial': { icon: '💳', color: '#06b6d4', title: 'Financial Planning' },
      'risk': { icon: '🛡️', color: '#f97316', title: 'Risk Management' },
      'innovation': { icon: '💡', color: '#84cc16', title: 'Innovation & Growth' }
    };

    // Enhanced recommendation text with detailed explanations
    const enhanceRecommendation = (originalRec) => {
      const lowerRec = originalRec.toLowerCase();
      
      if (lowerRec.includes('revenue') || lowerRec.includes('turnover') || lowerRec.includes('sales')) {
        return {
          type: 'revenue',
          title: 'Revenue Growth Strategy',
          content: `${originalRec}

Implement a diversified revenue strategy focusing on customer acquisition and new market segments. This approach can lead to 15-25% revenue growth within 12-18 months.`
        };
      }
      
      if (lowerRec.includes('employment') || lowerRec.includes('staff') || lowerRec.includes('hiring') || lowerRec.includes('workforce')) {
        return {
          type: 'employment',
          title: 'Workforce Optimization',
          content: `${originalRec}

Focus on strategic hiring and employee development with clear performance metrics. Proper workforce optimization can improve productivity by 20-30%.`
        };
      }
      
      if (lowerRec.includes('capital') || lowerRec.includes('funding') || lowerRec.includes('investment') || lowerRec.includes('finance')) {
        return {
          type: 'capital',
          title: 'Capital Management',
          content: `${originalRec}

Develop detailed cash flow planning and explore diverse funding options. Effective capital management improves cash flow predictability by 35-50%.`
        };
      }
      
      if (lowerRec.includes('market') || lowerRec.includes('customer') || lowerRec.includes('competition') || lowerRec.includes('sector')) {
        return {
          type: 'market',
          title: 'Market Positioning',
          content: `${originalRec}

Conduct competitor analysis and develop unique value propositions for your business. Strong market positioning leads to 25-35% better customer retention.`
        };
      }
      
      if (lowerRec.includes('operational') || lowerRec.includes('efficiency') || lowerRec.includes('process') || lowerRec.includes('productivity')) {
        return {
          type: 'operational',
          title: 'Operational Excellence',
          content: `${originalRec}

Optimize key business processes and implement quality management systems. This typically achieves 20-30% improvement in operational efficiency.`
        };
      }
      
      if (lowerRec.includes('risk') || lowerRec.includes('compliance') || lowerRec.includes('regulation') || lowerRec.includes('legal')) {
        return {
          type: 'risk',
          title: 'Risk Management',
          content: `${originalRec}

Conduct comprehensive risk assessment and ensure regulatory compliance. Proper risk management reduces business disruptions by 40-60%.`
        };
      }
      
      // Default enhanced recommendation for other types
      return {
        type: 'innovation',
        title: 'Business Growth',
        content: `${originalRec}

Develop growth plans with clear milestones and build strategic partnerships. Growth-focused strategies achieve 20-40% better long-term performance.`
      };
    };

    const enhanced = enhanceRecommendation(rec);
    const typeInfo = recommendationTypes[enhanced.type];
    
    return { ...enhanced, ...typeInfo };
  };

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
    const numericFields = [
      'business_capital',
      'turnover_first_year',
      'turnover_second_year', 
      'turnover_third_year',
      'turnover_fourth_year',
      'employment_first_year',
      'employment_second_year',
      'employment_third_year',
      'employment_fourth_year'
    ];
    
    if (numericFields.includes(name)) {
      // Format the number with commas for display
      const formattedValue = formatNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
      const capitalValue = parseFloat(parseNumber(formData.business_capital)) || 0;
      addLine('Business Capital', `${capitalValue.toLocaleString('en-US')} RWF`);
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
        const rawValue = formData[`turnover_${year}_year`] || '0';
        const numValue = parseFloat(parseNumber(rawValue)) || 0;
        const value = numValue.toLocaleString('en-US');
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
        const rawValue = formData[`employment_${year}_year`] || '0';
        const numValue = parseInt(parseNumber(rawValue)) || 0;
        const value = `${numValue.toLocaleString('en-US')} employees`;
        addLine(`Year ${index + 1}`, value, 30);
      });

      // PREDICTION RESULTS
      checkNewPage();
      addSectionHeader('PREDICTION RESULTS');
      
      // Main result with color
      const isSuccess = (predictionResult.prediction_label === 'Successful' || predictionResult.prediction === 1);
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
      // Get best available API URL (local first, then deployed)
      const apiUrl = await API_CONFIG.getApiUrl();
      
      const processedData = {
        business_capital: parseFloat(parseNumber(formData.business_capital)),
        business_sector: formData.business_sector,
        entity_type: formData.entity_type,
        business_location: formData.business_location,
        capital_source: formData.capital_source,
        turnover_first_year: parseFloat(parseNumber(formData.turnover_first_year)) || 0,
        turnover_second_year: parseFloat(parseNumber(formData.turnover_second_year)) || 0,
        turnover_third_year: parseFloat(parseNumber(formData.turnover_third_year)) || 0,
        turnover_fourth_year: parseFloat(parseNumber(formData.turnover_fourth_year)) || 0,
        employment_first_year: parseInt(parseNumber(formData.employment_first_year)) || 0,
        employment_second_year: parseInt(parseNumber(formData.employment_second_year)) || 0,
        employment_third_year: parseInt(parseNumber(formData.employment_third_year)) || 0,
        employment_fourth_year: parseInt(parseNumber(formData.employment_fourth_year)) || 0
      };

      console.log('Sending data to API:', processedData);
      
      try {
        // Try the selected API
        const response = await axios.post(`${apiUrl}/predict-existing-business`, processedData, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          timeout: 15000 // 15 second timeout
        });
        
        console.log('API Response:', response.data);
        
        // Check if response has prediction data (even if success is false)
        if (response.data && (response.data.prediction !== undefined || response.data.prediction_label)) {
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
        // If local API failed, try deployed API as fallback
        if (apiUrl === API_CONFIG.LOCAL_URL) {
          console.log('🔄 Local API failed, trying deployed API...');
          toast.loading('Switching to deployed API...', { id: 'api-fallback' });
          
          const fallbackResponse = await axios.post(`${API_CONFIG.DEPLOYED_URL}/predict-existing-business`, processedData, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 30000 // 30 seconds for deployed API (handles cold starts)
          });
          
          console.log('Fallback API Response:', fallbackResponse.data);
          
          // Check if response has prediction data (even if success is false)
          if (fallbackResponse.data && (fallbackResponse.data.prediction !== undefined || fallbackResponse.data.prediction_label)) {
            toast.success('Prediction completed successfully!', { id: 'api-fallback' });
            setPredictionResult(fallbackResponse.data);
            setShowResults(true);
            setTimeout(() => {
              const resultsElement = document.getElementById('prediction-results');
              if (resultsElement) {
                resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
            return;
          }
        }
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
      background: 'linear-gradient(135deg, #e6f2ff 0%, #cce7ff 100%)',
      color: '#1a1a1a',
      minHeight: '100vh',
      padding: isMobile ? '10px' : isTablet ? '15px' : '20px'
    }}>
      <div style={{ 
        maxWidth: isMobile ? '100%' : isTablet ? '95%' : '1200px', 
        margin: '0 auto' 
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '30px' : '40px' }}>
          <h1 style={{
            fontSize: isMobile ? '2rem' : isTablet ? '2.2rem' : '2.5rem',
            marginBottom: '10px',
            color: '#2d3748',
            fontWeight: '800',
            lineHeight: '1.2',
            padding: isMobile ? '0 10px' : '0'
          }}>
            Existing Business Success Predictor
          </h1>
          <p style={{ 
            fontSize: isMobile ? '1rem' : '1.1rem', 
            color: '#4a5568',
            padding: isMobile ? '0 10px' : '0'
          }}>
            AI-powered analysis of your business performance with SHAP-based recommendations
          </p>
        </div>

        {/* Form Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: isMobile ? '15px' : '20px',
          padding: isMobile ? '20px' : isTablet ? '30px' : '40px',
          marginBottom: isMobile ? '20px' : '30px',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
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
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))',
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
                    style={{
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#ffffff',
                      color: '#2d3748',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                    style={{
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#ffffff',
                      color: '#2d3748',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select capital source...</option>
                    {capitalSources.map(source => (
                      <option key={source} value={source} style={{ background: '#ffffff', color: '#2d3748', padding: '8px' }}>
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
                    style={{
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#ffffff',
                      color: '#2d3748',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select entity type...</option>
                    {entityTypes.map(type => (
                      <option key={type} value={type} style={{ background: '#ffffff', color: '#2d3748', padding: '8px' }}>
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
                  <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                    Business Sector *
                  </label>
                  <select
                    name="business_sector"
                    value={formData.business_sector}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#ffffff',
                      color: '#2d3748',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select business sector...</option>
                    {businessSectors.map(sector => (
                      <option key={sector} value={sector} style={{ background: '#ffffff', color: '#2d3748', padding: '8px' }}>
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
                    style={{
                      padding: '14px 16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      background: '#ffffff',
                      color: '#2d3748',
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select district...</option>
                    {businessLocations.map(location => (
                      <option key={location} value={location} style={{ background: '#ffffff', color: '#2d3748', padding: '8px' }}>
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
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: isMobile ? '15px' : '20px'
              }}>
                {['first', 'second', 'third', 'fourth'].map((year, index) => (
                  <div key={year} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                      {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Year Revenue (RWF) *
                    </label>
                    <input
                      type="text"
                      name={`turnover_${year}_year`}
                      value={formData[`turnover_${year}_year`]}
                      onChange={handleInputChange}
                      required
                      placeholder={`e.g., ${(12000000 + (index * 6000000)).toLocaleString()}`}
                      style={{
                        padding: '14px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        background: '#ffffff',
                        color: '#2d3748',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: isMobile ? '15px' : '20px'
              }}>
                {['first', 'second', 'third', 'fourth'].map((year, index) => (
                  <div key={year} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ marginBottom: '8px', fontWeight: '700', color: '#374151' }}>
                      {index + 1}{index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} Year Employees
                    </label>
                    <input
                      type="text"
                      name={`employment_${year}_year`}
                      value={formData[`employment_${year}_year`]}
                      onChange={handleInputChange}
                      placeholder={`e.g., ${5 + (index * 3)}`}
                      style={{
                        padding: '14px 16px',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        background: '#ffffff',
                        color: '#2d3748',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#667eea'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
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
                padding: isMobile ? '14px 24px' : '16px 32px',
                borderRadius: '10px',
                fontFamily: "'Space Mono', monospace",
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontWeight: '700',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                width: '100%',
                maxWidth: isMobile ? '100%' : '400px',
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
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: isMobile ? '20px' : isTablet ? '30px' : '40px',
              marginTop: '30px',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
              maxWidth: isMobile ? '100%' : '900px',
              margin: '30px auto 0 auto'
            }}
          >
            <h2 style={{
              textAlign: 'center',
              fontSize: '2rem',
              marginBottom: '20px',
              color: '#1a1a1a',
              fontWeight: '800'
            }}>
              {(predictionResult.prediction_label === 'Successful' || predictionResult.prediction === 1) ? 'Business Success Prediction' : 'Business Risk Assessment'}
            </h2>

            {/* Main Prediction Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 300px))',
              gap: isMobile ? '15px' : '20px',
              marginBottom: '30px',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: `2px solid ${(predictionResult.prediction_label === 'Successful' || predictionResult.prediction === 1) ? '#22c55e' : '#ef4444'}`,
                borderRadius: '15px',
                padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '10px', fontWeight: '600' }}>Prediction Result</div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: (predictionResult.prediction_label === 'Successful' || predictionResult.prediction === 1) ? '#22c55e' : '#ef4444'
                }}>
                  {predictionResult.prediction}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #3b82f6',
                borderRadius: '15px',
                padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '10px', fontWeight: '600' }}>Success Probability</div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#3b82f6'
                }}>
                  {(predictionResult.success_probability * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Timestamp */}
            {predictionResult.timestamp && (
              <div style={{ 
                textAlign: 'center', 
                fontSize: '0.9rem', 
                color: '#4a5568',
                marginBottom: '30px',
                padding: '15px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '10px',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                Analysis completed: {new Date(predictionResult.timestamp).toLocaleString()}
              </div>
            )}

            {/* Business Insights */}
            {predictionResult.business_insights && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 300px))',
                gap: isMobile ? '15px' : '20px',
                marginBottom: '30px',
                justifyContent: 'center'
              }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: isMobile ? '15px' : '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '5px', fontWeight: '600' }}>Employment Efficiency</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>
                    {predictionResult.business_insights.employment_efficiency?.toFixed(2) || 'N/A'}
                  </div>
                </div>
                
                <div style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '20px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '2px solid rgba(245, 87, 108, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                }}>
                  <div style={{ color: '#4a5568', fontSize: '0.9rem', marginBottom: '5px', fontWeight: '600' }}>Capital Efficiency</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1a1a1a' }}>
                    {predictionResult.business_insights.capital_efficiency?.toFixed(2) || 'N/A'}
                  </div>
                </div>
              </div>
            )}

            {/* Charts Section */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={{ 
                color: '#4a90e2', 
                marginBottom: '25px',
                fontSize: '1.3rem',
                fontWeight: '700',
                textAlign: 'center'
              }}>
                Business Analytics Dashboard
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr' : 'repeat(2, 1fr)',
                gap: isMobile ? '20px' : '25px',
                marginBottom: '30px'
              }}>
                {/* Factor Analysis Chart */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
                  borderRadius: '16px',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <FaChartLine style={{ color: '#3b82f6', fontSize: '1.2rem' }} />
                    <h4 style={{
                      color: '#3b82f6',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      margin: 0,
                      fontFamily: "'Space Mono', monospace"
                    }}>
                      Factor Analysis
                    </h4>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px', fontWeight: '500' }}>
                    Key Factors Impacting Success
                  </div>
                  <div style={{ height: isMobile ? '200px' : isTablet ? '225px' : '250px', maxWidth: '100%', overflow: 'hidden' }}>
                    <Bar 
                      data={generateFactorAnalysisData(predictionResult, formData)}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false
                          },
                          title: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 30,
                            grid: {
                              color: '#f3f4f6'
                            },
                            ticks: {
                              color: '#6b7280',
                              font: {
                                size: 11
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            },
                            ticks: {
                              color: '#6b7280',
                              font: {
                                size: 10
                              },
                              maxRotation: 45
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Success Distribution Chart */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
                  borderRadius: '16px',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '20px'
                  }}>
                    <FaShieldAlt style={{ color: '#22c55e', fontSize: '1.2rem' }} />
                    <h4 style={{
                      color: '#22c55e',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      margin: 0,
                      fontFamily: "'Space Mono', monospace"
                    }}>
                      Success Distribution
                    </h4>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '15px', fontWeight: '500' }}>
                    Success vs Risk Probability
                  </div>
                  <div style={{ 
                    height: isMobile ? '200px' : isTablet ? '225px' : '250px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: isMobile ? '150px' : isTablet ? '175px' : '200px', 
                      height: isMobile ? '150px' : isTablet ? '175px' : '200px', 
                      position: 'relative',
                      maxWidth: '100%'
                    }}>
                      <Doughnut 
                        data={generateSuccessDistributionData(predictionResult)}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'bottom',
                              labels: {
                                color: '#6b7280',
                                font: {
                                  size: 11
                                },
                                padding: 15,
                                usePointStyle: true
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context) {
                                  return context.label + ': ' + context.parsed + '%';
                                }
                              }
                            }
                          },
                          cutout: '75%',
                          circumference: 180,
                          rotation: 270
                        }}
                      />
                      
                      {/* Dynamic Needle/Pin */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '2px',
                        height: '60px',
                        backgroundColor: '#1f2937',
                        transformOrigin: 'bottom center',
                        transform: `translate(-50%, -100%) rotate(${(predictionResult.success_probability * 180) - 90}deg)`,
                        zIndex: 10,
                        borderRadius: '2px'
                      }}>
                        {/* Needle tip */}
                        <div style={{
                          position: 'absolute',
                          top: '-3px',
                          left: '-3px',
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#ef4444',
                          borderRadius: '50%',
                          border: '2px solid #fff'
                        }}></div>
                      </div>
                      
                      {/* Center hub */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '12px',
                        height: '12px',
                        backgroundColor: '#1f2937',
                        borderRadius: '50%',
                        zIndex: 15,
                        border: '2px solid #fff'
                      }}></div>
                      
                      {/* Center percentage display */}
                      <div style={{
                        position: 'absolute',
                        top: '65%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <div style={{
                          fontSize: '1.4rem',
                          fontWeight: '700',
                          color: predictionResult.success_probability >= 0.75 ? '#22c55e' :
                                 predictionResult.success_probability >= 0.50 ? '#eab308' :
                                 predictionResult.success_probability >= 0.25 ? '#f97316' : '#ef4444'
                        }}>
                          {(predictionResult.success_probability * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Recommendations */}
            {predictionResult.recommendations && predictionResult.recommendations.length > 0 && (
              <div style={{ marginTop: '40px' }}>
                <h3 style={{ 
                  color: '#4a90e2', 
                  marginBottom: '25px',
                  fontSize: '1.4rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: '700',
                  textAlign: 'center',
                  justifyContent: 'center'
                }}>
                  <FaLightbulb style={{ color: '#f59e0b', fontSize: '1.2em' }} />
                  Strategic AI-Powered Recommendations ({predictionResult.recommendations.length})
                </h3>
                
                {/* Single Card with All Recommendations */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '35px',
                    borderRadius: '20px',
                    border: '3px solid rgba(74, 144, 226, 0.2)',
                    boxShadow: '0 10px 30px rgba(74, 144, 226, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Decorative gradient accent */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: 'linear-gradient(90deg, #4a90e2, #667eea, #764ba2)'
                  }}></div>
                  
                  {/* Recommendations List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                    {predictionResult.recommendations.map((rec, index) => {
                      const enhanced = formatRecommendation(rec, index);
                      return (
                        <div 
                          key={index}
                          style={{
                            paddingBottom: index < predictionResult.recommendations.length - 1 ? '25px' : '0',
                            borderBottom: index < predictionResult.recommendations.length - 1 ? `2px solid ${enhanced.color}20` : 'none'
                          }}
                        >
                          {/* Individual Recommendation Header */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                            marginBottom: '15px'
                          }}>
                            <div style={{ flex: 1 }}>
                              <h4 style={{
                                color: enhanced.color,
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                margin: '0 0 5px 0',
                                fontFamily: "'Space Mono', monospace"
                              }}>
                                {enhanced.title}
                              </h4>
                              <div style={{
                                color: '#6b7280',
                                fontSize: '0.85rem',
                                fontWeight: '500'
                              }}>
                                Recommendation #{index + 1} • Priority: High
                              </div>
                            </div>
                          </div>
                          
                          {/* Recommendation Content */}
                          <div style={{
                            fontSize: '0.95rem',
                            lineHeight: '1.7',
                            color: '#374151',
                            fontWeight: '500',
                            whiteSpace: 'pre-line',
                            paddingLeft: '20px'
                          }}>
                            {enhanced.content}
                          </div>
                          
                          {/* Action indicator for each recommendation */}
                          <div style={{
                            marginTop: '15px',
                            marginLeft: '20px',
                            padding: '10px 16px',
                            background: `${enhanced.color}10`,
                            borderRadius: '8px',
                            border: `1px solid ${enhanced.color}30`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: enhanced.color
                            }}></div>
                            <span style={{
                              color: enhanced.color,
                              fontSize: '0.8rem',
                              fontWeight: '600'
                            }}>
                              Implement this strategy for maximum business impact
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Overall Action Call */}
                  <div style={{
                    marginTop: '25px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(102, 126, 234, 0.1))',
                    borderRadius: '12px',
                    border: '2px solid rgba(74, 144, 226, 0.2)',
                    textAlign: 'center'
                  }}>
                    <h5 style={{
                      color: '#4a90e2',
                      fontSize: '1rem',
                      fontWeight: '700',
                      margin: '0 0 8px 0'
                    }}>
                      Ready to Transform Your Business?
                    </h5>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      margin: '0',
                      fontWeight: '500'
                    }}>
                      Implement these AI-powered recommendations to accelerate your business growth and success.
                    </p>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Risk Factors */}
            {predictionResult.risk_factors && predictionResult.risk_factors.length > 0 && (
              <div style={{ marginTop: '30px' }}>
                <h3 style={{ 
                  color: '#e53e3e', 
                  marginBottom: '15px',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: '700'
                }}>
                  Risk Factors ({predictionResult.risk_factors.length})
                </h3>
                <div>
                  {predictionResult.risk_factors.map((risk, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      padding: '20px',
                      borderRadius: '12px',
                      marginBottom: '15px',
                      border: '2px solid rgba(229, 62, 62, 0.3)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                    }}>
                      <div style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        color: '#2d3748',
                        fontWeight: '500'
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
              background: 'rgba(255, 255, 255, 0.8)',
              border: '2px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              padding: isMobile ? '15px' : isTablet ? '20px' : '25px',
              marginTop: '30px',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
            }}>
              <h4 style={{ 
                color: '#d97706', 
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
                color: '#4a5568',
                fontWeight: '500'
              }}>
                This AI prediction is for informational purposes only and should not be considered as professional business advice. 
                Results are based on statistical patterns and may not account for all factors affecting business success.
              </p>
              <p style={{ 
                fontSize: '0.9rem', 
                lineHeight: '1.6',
                margin: '0',
                color: '#2d3748',
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
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '2px solid rgba(74, 144, 226, 0.3)',
                  color: '#4a90e2',
                  fontFamily: "'Space Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#4a90e2';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.color = '#4a90e2';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Analyze Another Business
              </button>
              
              <button
                onClick={downloadPDF}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  color: 'white',
                  fontFamily: "'Space Mono', monospace",
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: '600',
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
                }}
              >
                Download Report
              </button>
            </div>

            {/* Feedback Section */}
            <FeedbackForm predictionType="existing_business" />
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

      {/* Add CSS animation for spinner only */}
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