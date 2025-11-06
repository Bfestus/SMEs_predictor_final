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
                    }}>93.5%</div>
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
                    }}>19</div>
                    <div className="text-lg font-medium" style={{
                      color: '#2d2d2d',
                      fontFamily: 'Space Mono, monospace',
                      textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                    }}>Business Sectors</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative" style={{ 
        background: 'rgba(248, 250, 252, 0.9)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="absolute inset-0" style={{ 
          background: 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{
              color: '#1a1a1a',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}>
              Why Choose Our Platform?
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{
              color: '#4a5568',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.7
            }}>
              Discover the advanced features that make our AI-powered SME prediction platform 
              the most trusted choice for businesses across Rwanda.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="h-full p-6 rounded-2xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-105" style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  <div className="text-4xl mb-4 text-blue-600">
                    <feature.icon />
                  </div>
                  <h3 className="text-xl font-bold mb-4" style={{
                    color: '#1a1a1a',
                    fontFamily: 'Space Mono, monospace',
                    fontWeight: 700
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    color: '#4a5568',
                    fontFamily: 'Space Mono, monospace',
                    lineHeight: 1.6
                  }}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0" style={{ 
          background: 'rgba(240, 248, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{
              color: '#1a1a1a',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 800,
              letterSpacing: '-0.02em'
            }}>
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto" style={{
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
                className="btn-primary text-lg px-8 py-4"
              >
                Get Started Now
              </Link>
              <Link
                to="/services"
                className="btn-secondary text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
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
