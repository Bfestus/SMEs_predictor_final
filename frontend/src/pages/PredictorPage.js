import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PredictorPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16" style={{ fontFamily: "'Space Mono', monospace" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-6" style={{ color: '#1f2937', fontFamily: "'Space Mono', monospace" }}>
            <span style={{ color: '#3b82f6' }}>SME Success</span> Predictor
          </h1>
          <p className="text-xl max-w-4xl mx-auto text-gray-600 leading-relaxed" style={{ fontFamily: "'Space Mono', monospace" }}>
            Advanced AI-powered business success prediction platform for Small and Medium Enterprises in Rwanda
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-blue-700">AI Models Active</span>
          </div>
        </motion.div>

        {/* Selection Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          {/* Pre-Investment Business Card */}
          <motion.div
            onHoverStart={() => setHoveredCard('pre-investment')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="cursor-pointer group"
            onClick={() => navigate('/predictor/pre-investment')}
          >
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Pre-Investment Analysis
                  </h3>
                  <p className="text-blue-100 opacity-90" style={{ fontFamily: "'Space Mono', monospace" }}>
                    For startup concepts and business ideas seeking investment
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Business concept viability assessment</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Owner qualifications & experience evaluation</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Market opportunity and competitive analysis</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Capital requirements and funding strategy</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    STARTUP FOCUSED
                  </div>
                  <motion.div
                    animate={{ x: hoveredCard === 'pre-investment' ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-blue-600 group-hover:text-blue-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Existing Business Card */}
          <motion.div
            onHoverStart={() => setHoveredCard('existing')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="cursor-pointer group"
            onClick={() => navigate('/predictor/existing-business')}
          >
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4 backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                    Existing Business Analysis
                  </h3>
                  <p className="text-green-100 opacity-90" style={{ fontFamily: "'Space Mono', monospace" }}>
                    For operational businesses with financial history
                  </p>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">4-year revenue performance analysis</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Financial growth patterns and trends</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Revenue consistency and volatility metrics</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">Industry benchmarking and recommendations</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                    PERFORMANCE FOCUSED
                  </div>
                  <motion.div
                    animate={{ x: hoveredCard === 'existing' ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-green-600 group-hover:text-green-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
              Comprehensive Business Intelligence
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our AI models analyze different aspects of your business depending on your current stage and requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="border-l-4 border-blue-500 pl-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Pre-Investment Intelligence
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Market opportunity assessment</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Founder capability evaluation</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Capital structure optimization</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Strategic recommendations</span>
                </div>
              </div>
            </div>
            
            <div className="border-l-4 border-green-500 pl-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Performance Intelligence
                </h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Financial performance trends</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Industry benchmarking</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Risk assessment analysis</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Growth optimization insights</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PredictorPage;