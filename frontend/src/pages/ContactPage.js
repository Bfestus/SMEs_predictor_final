import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaClock, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: FaEnvelope,
      title: 'Email',
      details: ['info@smepredictor.rw', 'support@smepredictor.rw'],
      description: 'Send us your inquiries anytime'
    },
    {
      icon: FaClock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 3:00 PM', 'Sunday: Closed'],
      description: 'We are here to help during business hours'
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Space Mono', monospace" }}>
      {/* Hero Section */}
      <section 
        className="text-white py-20"
        style={{ backgroundColor: '#1e3a5f' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{ color: '#4a90e2', fontFamily: "'Space Mono', monospace" }}>
              Contact Us
            </h1>
            <p className="text-xl lg:text-2xl max-w-4xl mx-auto" style={{ color: '#e2e8f0', fontFamily: "'Space Mono', monospace" }}>
              Get in touch with our team of experts. We're here to help you make 
              informed business decisions with our AI-powered solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#4a90e2', fontFamily: "'Space Mono', monospace" }}>
              Get in Touch
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
              We're always excited to hear from entrepreneurs and businesses looking to 
              leverage AI for better decision making. Reach out to us via email:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ background: '#1e3a5f' }}>
                  <info.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#1a1a1a', fontFamily: "'Space Mono', monospace" }}>
                  {info.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                  {info.description}
                </p>
                {info.details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="font-medium mb-1" style={{ color: '#4a90e2', fontFamily: "'Space Mono', monospace" }}>
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <div className="card max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a', fontFamily: "'Space Mono', monospace" }}>
                Follow Us
              </h3>
              <div className="flex justify-center space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  style={{ background: '#1877f2' }}
                >
                  <FaFacebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  style={{ background: '#1da1f2' }}
                >
                  <FaTwitter size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  style={{ background: '#0077b5' }}
                >
                  <FaLinkedin size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#4a90e2', fontFamily: "'Space Mono', monospace" }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl" style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
              Quick answers to common questions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How accurate are your predictions?",
                answer: "Our AI model achieves 85% accuracy based on analysis of 10,000+ business records from Rwanda."
              },
              {
                question: "Is my business data secure?",
                answer: "Yes, we use enterprise-grade security measures and never share your data with third parties."
              },
              {
                question: "What information do I need to provide?",
                answer: "Basic business details like capital, sector, location, owner info, and employee count."
              },
              {
                question: "Can I get predictions for multiple businesses?",
                answer: "Yes, our API and batch services support multiple business analysis at once."
              },
              {
                question: "Do you provide ongoing support?",
                answer: "Yes, we offer consulting services and customer support for all our users."
              },
              {
                question: "How quickly do I get results?",
                answer: "Predictions are generated instantly. Detailed reports are typically delivered within 24 hours."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#4a90e2', fontFamily: "'Space Mono', monospace" }}>
                  {faq.question}
                </h3>
                <p style={{ color: '#2d2d2d', fontFamily: "'Space Mono', monospace" }}>
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;