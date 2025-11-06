import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BusinessTypeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12" style={{ 
      fontFamily: "'Space Mono', monospace",
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
    }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4" style={{ 
            background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontFamily: "'Space Mono', monospace" 
          }}>
            <span style={{ 
              background: 'linear-gradient(45deg, #22c55e, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SME Success</span> Predictor
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-8" style={{ 
            color: '#e2e8f0', 
            fontFamily: "'Space Mono', monospace" 
          }}>
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
          >
            <div 
              className="card relative overflow-hidden h-80 hover:transform hover:scale-105 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #581c87 100%)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(30, 64, 175, 0.3)'
              }}
            >
              <div className="absolute inset-0" style={{ 
                background: 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(55, 48, 163, 0.1) 100%)',
                backdropFilter: 'blur(10px)'
              }}></div>
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <div className="text-6xl mb-6">💡</div>
                <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Pre-Investment Business
                </h2>
                <p className="text-lg mb-6 text-blue-100" style={{ fontFamily: "'Space Mono', monospace" }}>
                  For businesses that are still in the planning phase or seeking initial investment
                </p>
                <div className="bg-white/20 px-4 py-2 rounded-lg mb-4">
                  <span className="text-sm font-medium text-white">Business Ideas & Concepts</span>
                </div>
                <button
                  onClick={() => navigate('/predictor/pre-investment')}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
                    fontFamily: "'Space Mono', monospace"
                  }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>

          {/* Existing Business */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="cursor-pointer"
          >
            <div 
              className="card relative overflow-hidden h-80 hover:transform hover:scale-105 transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(5, 150, 105, 0.3)'
              }}
            >
              <div className="absolute inset-0" style={{ 
                background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(4, 120, 87, 0.1) 100%)',
                backdropFilter: 'blur(10px)'
              }}></div>
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
                <div className="text-6xl mb-6">📈</div>
                <h2 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Existing Business
                </h2>
                <p className="text-lg mb-6 text-green-100" style={{ fontFamily: "'Space Mono', monospace" }}>
                  For businesses that are already operational with financial history
                </p>
                <div className="bg-white/20 px-4 py-2 rounded-lg mb-4">
                  <span className="text-sm font-medium text-white">Operational & Financial Data</span>
                </div>
                <button
                  onClick={() => navigate('/predictor/existing-business')}
                  className="px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: 'linear-gradient(45deg, #22c55e, #16a34a)',
                    border: '1px solid rgba(34, 197, 94, 0.5)',
                    boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3)',
                    fontFamily: "'Space Mono', monospace"
                  }}
                >
                  Get Started
                </button>
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
          <h3 className="text-2xl font-bold text-center mb-8" style={{ 
            color: '#e2e8f0', 
            fontFamily: "'Space Mono', monospace" 
          }}>
            What Each Prediction Analyzes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg p-6 border" style={{
              background: 'rgba(30, 64, 175, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 className="text-lg font-semibold mb-4" style={{ 
                color: '#93c5fd', 
                fontFamily: "'Space Mono', monospace" 
              }}>
                Pre-Investment Analysis
              </h4>
              <ul className="space-y-2 text-sm" style={{ 
                color: '#cbd5e1', 
                fontFamily: "'Space Mono', monospace" 
              }}>
                <li>• Business concept viability</li>
                <li>• Owner qualifications & experience</li>
                <li>• Market opportunity assessment</li>
                <li>• Capital requirements & sources</li>
                <li>• Location and sector analysis</li>
              </ul>
            </div>
            <div className="rounded-lg p-6 border" style={{
              background: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              backdropFilter: 'blur(10px)'
            }}>
              <h4 className="text-lg font-semibold mb-4" style={{ 
                color: '#86efac', 
                fontFamily: "'Space Mono', monospace" 
              }}>
                Existing Business Analysis
              </h4>
              <ul className="space-y-2 text-sm" style={{ 
                color: '#cbd5e1', 
                fontFamily: "'Space Mono', monospace" 
              }}>
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