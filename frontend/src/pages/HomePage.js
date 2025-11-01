import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaChartLine, FaLightbulb, FaShieldAlt, FaRocket } from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: FaChartLine,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze business data to predict success probability with high accuracy.'
    },
    {
      icon: FaLightbulb,
      title: 'Smart Recommendations',
      description: 'Get actionable insights and personalized recommendations to improve your business success chances.'
    },
    {
      icon: FaShieldAlt,
      title: 'Data Security',
      description: 'Your business data is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: FaRocket,
      title: 'Instant Results',
      description: 'Get immediate predictions and analysis within seconds of submitting your business information.'
    }
  ];

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite'
    }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ 
        background: 'rgba(240, 248, 255, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="absolute inset-0" style={{ 
          background: 'rgba(240, 248, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight" style={{
                color: '#1a1a1a',
                fontFamily: 'Space Mono, monospace',
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}>
                Predict Your <span style={{ color: '#4a90e2' }}>SME Success</span> with AI
              </h1>
              <p className="text-xl lg:text-2xl mb-8" style={{
                color: '#2d2d2d',
                fontFamily: 'Space Mono, monospace',
                fontWeight: 400,
                lineHeight: 1.7
              }}>
                Empower your business decisions with AI-driven predictions for Rwandan SMEs. 
                Get instant success probability analysis and actionable recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/predictor"
                  className="btn-primary text-lg px-8 py-4 text-center"
                >
                  Start Prediction
                </Link>
                <Link
                  to="/contact"
                  className="btn-secondary text-lg px-8 py-4 text-center"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
            
            {/* Stats Card - Professional Metrics Display */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center items-center"
            >
              <div className="relative w-80 h-96">
                {/* Main Stats Card */}
                <div className="rounded-3xl p-8 shadow-2xl h-full flex flex-col justify-center space-y-12 border" style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
                }}>
                  
                  {/* Prediction Accuracy */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-center"
                  >
                    <div className="text-6xl font-bold mb-2" style={{
                      color: '#1a1a1a',
                      fontFamily: 'Space Mono, monospace',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                    }}>85%</div>
                    <div className="text-lg font-medium" style={{
                      color: '#2d2d2d',
                      fontFamily: 'Space Mono, monospace',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                    }}>Prediction Accuracy</div>
                  </motion.div>
                  
                  {/* Districts Covered */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-bold mb-2" style={{
                      color: '#1a1a1a',
                      fontFamily: 'Space Mono, monospace',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                    }}>30</div>
                    <div className="text-lg font-medium" style={{
                      color: '#2d2d2d',
                      fontFamily: 'Space Mono, monospace',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                    }}>Districts Covered</div>
                  </motion.div>
                  
                  {/* Business Sectors */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-center"
                  >
                    <div className="text-5xl font-bold mb-2" style={{
                      color: '#1a1a1a',
                      fontFamily: 'Space Mono, monospace',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      textShadow: '0 2px 4px rgba(255, 255, 255, 0.8)'
                    }}>22</div>
                    <div className="text-lg font-medium" style={{
                      color: '#2d2d2d',
                      fontFamily: 'Space Mono, monospace',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                    }}>Business Sectors</div>
                  </motion.div>
                  
                  {/* Subtle background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-20 h-20 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-8 left-4 w-16 h-16 border border-white/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-2 w-12 h-12 border border-white/30 rounded-full"></div>
                    <div className="absolute bottom-4 right-8 w-8 h-8 border border-white/30 rounded-full"></div>
                  </div>
                  
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 rounded-3xl opacity-20 blur-xl -z-10 animate-pulse" style={{
                    background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.3) 0%, rgba(45, 90, 160, 0.2) 100%)'
                  }}></div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute -top-3 -right-3 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg"
                  style={{border: '1px solid #e2e8f0'}}
                >
                  <span className="text-xs font-bold" style={{
                    color: 'var(--color-primary)',
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: '700'
                  }}>AI</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="absolute -bottom-2 -left-2 bg-white rounded-full w-5 h-5 animate-bounce"
                  style={{border: '1px solid #e2e8f0'}}
                />
                
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.6 }}
                  className="absolute top-1/4 -left-3 bg-white rounded-full w-4 h-4 animate-ping"
                  style={{border: '1px solid #e2e8f0'}}
                />
                
                {/* Additional floating particles */}
                <div className="absolute inset-0 -z-20">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        y: [-20, -40, -60],
                        x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
                      }}
                      transition={{
                        duration: 3,
                        delay: 2 + i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="absolute w-2 h-2 bg-white rounded-full"
                      style={{
                        left: `${10 + i * 10}%`,
                        bottom: '10%',
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-10">
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl text-blue-200"
          >
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <motion.div
            animate={{ y: [20, -20, 20] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="text-6xl text-blue-200"
          >
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{
              color: '#1a1a1a',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              How It Works
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{
              color: '#2d2d2d',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.7
            }}>
              Get your business success prediction in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Enter Business Details',
                description: 'Provide information about your business capital, sector, location, and owner details.'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our machine learning model analyzes your data against 10,000+ business records.'
              },
              {
                step: '03',
                title: 'Get Insights',
                description: 'Receive success probability, risk assessment, and personalized recommendations.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
                className="card text-center relative group hover:scale-105 transition-transform duration-300"
                style={{ minHeight: '320px' }}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 text-white rounded-full text-2xl font-bold mb-6 shadow-lg" style={{
                    background: '#4a90e2',
                    fontFamily: 'Space Mono, monospace'
                  }}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4" style={{
                    color: '#1a1a1a',
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: 700
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: '#2d2d2d',
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: 400,
                    lineHeight: 1.6
                  }}>
                    {item.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full z-10">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-0.5" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                      <div className="text-2xl mx-4" style={{ color: 'var(--color-primary)' }}>→</div>
                      <div className="w-8 h-0.5" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative" style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #77509fff 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite'
      }}>
        <div className="absolute inset-0" style={{ 
          background: 'rgba(240, 248, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{
              color: '#4a90e2',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              Why Choose Our SME Predictor?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{
              color: '#2d2d2d',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.7
            }}>
              Our AI-powered platform combines advanced machine learning with deep understanding 
              of the Rwandan business landscape to provide accurate, actionable insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 text-white rounded-full mb-4 group-hover:scale-110 transition-transform shadow-lg" style={{
                  background: '#4a90e2'
                }}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{
                  color: '#1a1a1a',
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 700
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#2d2d2d',
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 400,
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4" style={{
              color: '#1a1a1a',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              Ready to Predict Your Business Success?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{
              color: '#2d2d2d',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.7
            }}>
              Join thousands of Rwandan entrepreneurs who are making data-driven business decisions
            </p>
            <Link
              to="/predictor"
              className="inline-block font-bold py-4 px-8 rounded-lg transition-colors text-lg shadow-lg"
              style={{
                background: '#4a90e2',
                color: 'white',
                fontFamily: 'Space Mono, monospace',
                fontWeight: 700
              }}
              onMouseEnter={(e) => e.target.style.background = '#357abd'}
              onMouseLeave={(e) => e.target.style.background = '#4a90e2'}
            >
              Start Your Prediction Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;