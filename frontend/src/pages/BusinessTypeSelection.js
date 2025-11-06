import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BusinessTypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white py-12" style={{ fontFamily: "'Space Mono', monospace" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
            Choose the type of business prediction you need
          </p>
        </motion.div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pre-Investment Business */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="cursor-pointer"
            onClick={() => navigate('/predictor/pre-investment')}
          >
            <div 
              className="card relative overflow-hidden h-80 hover:transform hover:scale-105 transition-transform duration-300"
              style={{
                background: 'linear-gradient(180deg, #4a90e2 0%, #2d5aa0 100%)',
                color: 'white'
              }}
            >
              <div className="absolute inset-0" style={{ background: 'rgba(3, 10, 18, 0.1)' }}></div>
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <div className="text-6xl mb-6">💡</div>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Pre-Investment Business
                </h2>
                <p className="text-lg mb-6 opacity-90" style={{ fontFamily: "'Space Mono', monospace" }}>
                  For businesses that are still in the planning phase or seeking initial investment
                </p>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">Business Ideas & Concepts</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Existing Business */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="cursor-pointer"
            onClick={() => navigate('/predictor/existing-business')}
          >
            <div 
              className="card relative overflow-hidden h-80 hover:transform hover:scale-105 transition-transform duration-300"
              style={{
                background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                color: 'white'
              }}
            >
              <div className="absolute inset-0" style={{ background: 'rgba(3, 10, 18, 0.1)' }}></div>
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <div className="text-6xl mb-6">📈</div>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Existing Business
                </h2>
                <p className="text-lg mb-6 opacity-90" style={{ fontFamily: "'Space Mono', monospace" }}>
                  For businesses that are already operational with financial history
                </p>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  <span className="text-sm font-medium">Operational & Financial Data</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8" style={{ color: '#1a1a1a', fontFamily: "'Space Mono', monospace" }}>
            What Each Prediction Analyzes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="text-lg font-semibold mb-4 text-blue-800" style={{ fontFamily: "'Space Mono', monospace" }}>
                Pre-Investment Analysis
              </h4>
              <ul className="space-y-2 text-sm text-blue-700" style={{ fontFamily: "'Space Mono', monospace" }}>
                <li>• Business concept viability</li>
                <li>• Owner qualifications & experience</li>
                <li>• Market opportunity assessment</li>
                <li>• Capital requirements & sources</li>
                <li>• Location and sector analysis</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h4 className="text-lg font-semibold mb-4 text-green-800" style={{ fontFamily: "'Space Mono', monospace" }}>
                Existing Business Analysis
              </h4>
              <ul className="space-y-2 text-sm text-green-700" style={{ fontFamily: "'Space Mono', monospace" }}>
                <li>• 4-year revenue performance trends</li>
                <li>• Financial growth patterns</li>
                <li>• Revenue consistency & volatility</li>
                <li>• Business operational metrics</li>
                <li>• Performance benchmarking</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessTypeSelection;