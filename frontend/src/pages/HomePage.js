import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaLightbulb, FaShieldAlt, FaRocket } from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: FaChartLine,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze business data to predict success probability with high accuracy.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: FaLightbulb,
      title: 'Smart Recommendations',
      description: 'Get actionable insights and personalized recommendations to improve your business success chances.',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      icon: FaShieldAlt,
      title: 'Data Security',
      description: 'Your business data is protected with enterprise-grade security and privacy measures.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: FaRocket,
      title: 'Instant Results',
      description: 'Get immediate predictions and analysis within seconds of submitting your business information.',
      gradient: 'from-pink-500 to-red-600'
    }
  ];

  // Container variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '300% 300%',
      animation: 'gradientShift 20s ease infinite',
      willChange: 'transform',
      backfaceVisibility: 'hidden'
    }}>
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden" style={{ 
        background: 'rgba(240, 248, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="absolute inset-0" style={{ 
          background: 'rgba(240, 248, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                AI-Powered Business Intelligence
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-8 leading-tight" style={{
                color: '#1a1a1a',
                fontFamily: 'Space Mono, monospace',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Predict Your <span style={{ color: '#4a90e2' }}>SME Success</span> with AI
              </h1>
              
              <p className="text-base lg:text-lg mb-10 leading-relaxed" style={{
                color: '#2d2d2d',
                fontFamily: 'Space Mono, monospace',
                fontWeight: 400,
                lineHeight: 1.7
              }}>
                Empower your business decisions with AI-driven predictions for Rwandan SMEs. 
                Get instant success probability analysis and actionable recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/predictor"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 hover:shadow-2xl hover:scale-105 text-center"
                  style={{ fontFamily: 'Space Mono, monospace' }}
                >
                  <span className="relative z-10">Start Prediction</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 text-center"
                  style={{ fontFamily: 'Space Mono, monospace' }}
                >
                  Contact Us
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Space Mono, monospace' }}>93.5%</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600" style={{ fontFamily: 'Space Mono, monospace' }}>30</div>
                  <div className="text-sm text-gray-600">Districts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-pink-600" style={{ fontFamily: 'Space Mono, monospace' }}>19</div>
                  <div className="text-sm text-gray-600">Sectors</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Main Dashboard Card */}
                <div className="rounded-2xl p-6 shadow-xl border" style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)'
                }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold" style={{ 
                      color: '#1a1a1a',
                      fontFamily: 'Space Mono, monospace' 
                    }}>
                      Business Analytics
                    </h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-600">Live</span>
                    </div>
                  </div>
                  
                  {/* Chart/Image Section */}
                  <div className="h-36 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden border border-white/20">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                      </svg>
                    </div>
                    
                    {/* Central Business Icon */}
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-2 mx-auto shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="text-xs font-semibold text-gray-700 mb-1">SME Analytics</div>
                      <div className="text-xs text-gray-500">Real-time Predictions</div>
                    </div>
                    
                    {/* Floating Metrics */}
                    <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
                      <div className="text-xs text-gray-600">Accuracy</div>
                      <div className="text-xs font-bold text-green-600">93.5%</div>
                    </div>
                    
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
                      <div className="text-xs text-gray-600">Success</div>
                      <div className="text-xs font-bold text-blue-600">85%</div>
                    </div>
                    
                    <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
                      <div className="text-xs text-gray-600">Risk</div>
                      <div className="text-xs font-bold text-orange-600">Low</div>
                    </div>
                    
                    <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm rounded-md px-2 py-1 shadow-sm">
                      <div className="text-xs text-gray-600">Growth</div>
                      <div className="text-xs font-bold text-purple-600">High</div>
                    </div>
                    
                    {/* Animated Chart Line */}
                    <svg 
                      className="absolute inset-0 w-full h-full"
                    >
                      <path
                        d="M20,120 Q60,60 100,80 T180,40"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  
                  {/* Enhanced Metrics */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-700 font-medium text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>Success Rate</span>
                      </div>
                      <span className="font-bold text-green-600 text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>85%</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-gray-700 font-medium text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>Growth Potential</span>
                      </div>
                      <span className="font-bold text-blue-600 text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>High</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-gray-700 font-medium text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>Risk Level</span>
                      </div>
                      <span className="font-bold text-orange-600 text-xs" style={{ fontFamily: 'Space Mono, monospace' }}>Low</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">
                  <FaRocket />
                </div>
                
                <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg">
                  <FaLightbulb />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 relative" style={{ 
        background: 'rgba(240, 248, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        willChange: 'transform'
      }}>
        <div className="absolute inset-0" style={{ 
          background: 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{
              color: '#1a1a1a',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}>
              Why Choose Our Platform?
            </h2>
            <p className="text-base max-w-3xl mx-auto" style={{
              color: '#4a5568',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.7
            }}>
              Discover the advanced features that make our AI-powered SME prediction platform 
              the most trusted choice for businesses across Rwanda.
            </p>
          </motion.div>
          
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="group"
              >
                <div className="h-full p-6 rounded-2xl shadow-xl border-2 transition-all duration-200 hover:shadow-2xl hover:scale-105" style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                }}>
                  <div className="text-3xl mb-4 text-blue-600">
                    <feature.icon />
                  </div>
                  <h3 className="text-base font-bold mb-4" style={{
                    color: '#1a1a1a',
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: 700
                  }}>
                    {feature.title}
                  </h3>
                  <p className="text-xs" style={{
                    color: '#2d3748',
                    fontFamily: 'Space Mono, monospace',
                    lineHeight: 1.6,
                    fontWeight: 500
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 relative">
        <div className="absolute inset-0" style={{ 
          background: 'rgba(240, 248, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          willChange: 'transform'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 text-center">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6" style={{
              color: '#1a1a1a',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}>
              Ready to Transform Your Business?
            </h2>
            <p className="text-base mb-10 max-w-3xl mx-auto" style={{
              color: '#4a5568',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.7
            }}>
              Join thousands of Rwandan entrepreneurs who have already discovered 
              their success potential with our AI-powered platform. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/predictor"
                className="btn-primary text-sm px-8 py-4"
              >
                Get Started Now
              </Link>
              <Link
                to="/services"
                className="btn-secondary text-sm px-8 py-4"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          font-family: 'Space Mono, monospace';
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.9);
          color: #333;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
          font-family: 'Space Mono, monospace';
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
