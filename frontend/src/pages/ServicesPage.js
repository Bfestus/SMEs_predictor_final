import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaLightbulb, FaUsers, FaShieldAlt, FaCog, FaHandshake } from 'react-icons/fa';

const ServicesPage = () => {
  const services = [
    {
      icon: FaChartLine,
      title: 'Business Success Prediction',
      description: 'Get accurate AI-powered predictions of your business success probability based on 10+ key factors.',
      features: [
        'Real-time success probability analysis',
        '85% prediction accuracy',
        'Risk level assessment',
        'Confidence scoring'
      ],
      price: 'Free',
      popular: true
    },
    {
      icon: FaLightbulb,
      title: 'Smart Recommendations',
      description: 'Receive personalized business recommendations to improve your success chances.',
      features: [
        'Actionable improvement suggestions',
        'Sector-specific advice',
        'Capital optimization tips',
        'Growth strategy insights'
      ],
      price: 'Free',
      popular: false
    },
    {
      icon: FaUsers,
      title: 'Business Consulting',
      description: 'One-on-one consultation with our business experts to discuss your prediction results.',
      features: [
        '1-hour personalized session',
        'Expert business guidance',
        'Custom action plan',
        'Follow-up support'
      ],
      price: 'RWF 25,000',
      popular: false
    },
    {
      icon: FaShieldAlt,
      title: 'Premium Analytics',
      description: 'Advanced business analytics with detailed reports and comparative analysis.',
      features: [
        'Detailed PDF reports',
        'Market comparison analysis',
        'Historical trend analysis',
        'Competitive benchmarking'
      ],
      price: 'RWF 50,000',
      popular: false
    },
    {
      icon: FaCog,
      title: 'API Integration',
      description: 'Integrate our prediction engine directly into your existing business systems.',
      features: [
        'RESTful API access',
        'Custom implementation',
        'Technical support',
        'Bulk prediction processing'
      ],
      price: 'Custom',
      popular: false
    },
    {
      icon: FaHandshake,
      title: 'Enterprise Solutions',
      description: 'Comprehensive business intelligence solutions for large organizations and institutions.',
      features: [
        'Custom model training',
        'Multi-user dashboard',
        'Advanced reporting',
        'Dedicated support'
      ],
      price: 'Contact Us',
      popular: false
    }
  ];

  const industries = [
    {
      name: 'Agriculture & Agribusiness',
      icon: '🌾',
      description: 'Specialized predictions for agricultural businesses, farming cooperatives, and agri-tech startups.',
      benefits: ['Seasonal analysis', 'Weather impact assessment', 'Market demand forecasting']
    },
    {
      name: 'Information Technology',
      icon: '💻',
      description: 'Tech startup success predictions with focus on digital transformation and innovation.',
      benefits: ['Tech stack analysis', 'Market readiness assessment', 'Scalability evaluation']
    },
    {
      name: 'Manufacturing',
      icon: '🏭',
      description: 'Manufacturing business analysis including supply chain and production efficiency factors.',
      benefits: ['Production capacity analysis', 'Supply chain optimization', 'Quality control insights']
    },
    {
      name: 'Retail & Commerce',
      icon: '🛍️',
      description: 'Retail business predictions covering both traditional and e-commerce ventures.',
      benefits: ['Customer behavior analysis', 'Inventory optimization', 'Sales forecasting']
    },
    {
      name: 'Healthcare',
      icon: '🏥',
      description: 'Healthcare business success analysis for clinics, pharmacies, and health tech companies.',
      benefits: ['Regulatory compliance check', 'Patient volume analysis', 'Service demand forecasting']
    },
    {
      name: 'Financial Services',
      icon: '💰',
      description: 'Financial sector predictions including fintech, microfinance, and banking services.',
      benefits: ['Risk assessment modeling', 'Regulatory analysis', 'Market penetration strategies']
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Data Input',
      description: 'Provide your business information through our secure web interface or API.',
      icon: '📝'
    },
    {
      step: 2,
      title: 'AI Analysis',
      description: 'Our advanced machine learning model analyzes your data against thousands of similar businesses.',
      icon: '🤖'
    },
    {
      step: 3,
      title: 'Results & Insights',
      description: 'Receive detailed predictions, risk assessments, and personalized recommendations.',
      icon: '📊'
    },
    {
      step: 4,
      title: 'Action Planning',
      description: 'Implement our recommendations with optional consulting support for optimal results.',
      icon: '🚀'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl lg:text-2xl max-w-4xl mx-auto text-gray-200">
              Comprehensive AI-powered business intelligence solutions designed to help 
              Rwandan SMEs make informed decisions and achieve sustainable growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Service
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic predictions to enterprise solutions, we have the right service for your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative card group hover:scale-105 transition-transform duration-300 ${
                  service.popular ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform">
                    <service.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    {service.price !== 'Free' && service.price !== 'Custom' && service.price !== 'Contact Us' && (
                      <span className="text-gray-600">/month</span>
                    )}
                  </div>
                  <button className="w-full btn-primary">
                    {service.price === 'Free' ? 'Get Started' : 'Learn More'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process ensures you get accurate predictions and actionable insights quickly
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full">
                    <div className="flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      <div className="text-blue-500 text-xl mx-4">→</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Industry Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized insights for various business sectors across Rwanda
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-300"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{industry.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {industry.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {industry.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {industry.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-blue-600 text-xs">•</span>
                      </div>
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Proven Results
            </h2>
            <p className="text-xl text-gray-600">
              Our track record speaks for itself
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Businesses Analyzed', icon: '🏢' },
              { number: '85%', label: 'Prediction Accuracy', icon: '🎯' },
              { number: '500+', label: 'Success Stories', icon: '📈' },
              { number: '30', label: 'Districts Covered', icon: '🗺️' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center card"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Choose the service that best fits your business needs and start making data-driven decisions today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/predictor"
                className="inline-block bg-white text-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                🚀 Start Free Prediction
              </a>
              <a
                href="/contact"
                className="inline-block border-2 border-white text-white font-bold py-4 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-colors text-lg"
              >
                📞 Contact Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;