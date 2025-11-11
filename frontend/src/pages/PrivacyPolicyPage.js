import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '80px 20px 40px',
      fontFamily: '"Space Mono", monospace'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '50px' }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              marginBottom: '20px',
              background: 'linear-gradient(45deg, #0f172a, #1e3a8a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ fontSize: '1rem', color: '#475569' }}>
            Last Updated: November 11, 2025
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '20px' }}>
            Welcome to SME Predictor. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our AI-powered Small and Medium Enterprise success prediction platform. Please read 
            this privacy policy carefully. By using SME Predictor, you agree to the collection and use of information 
            in accordance with this policy.
          </p>
        </motion.section>

        {/* Section 1: Information We Collect */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            1. Information We Collect
          </h2>
          
          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Business Data You Provide
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '10px' }}>
            When you use our prediction service, we collect the following business information:
          </p>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li><strong>For New Businesses:</strong> Business sector, location (province/district), initial capital, entity type (Sole Proprietorship, Limited Liability Company, etc.), capital source (Personal Savings, Bank Loan, Microfinance, etc.)</li>
            <li><strong>For Existing Businesses:</strong> All of the above plus 4 years of historical revenue data and employment figures</li>
          </ul>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Technical Data Automatically Collected
          </h3>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li>IP address and general location information</li>
            <li>Browser type and version</li>
            <li>Device information (desktop, mobile, tablet)</li>
            <li>Date and time of predictions</li>
            <li>Pages visited and features used</li>
          </ul>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            What We Don't Collect
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155' }}>
            SME Predictor does <strong>not</strong> require account creation, personal identification, email addresses, 
            phone numbers, or any personally identifiable information (PII). All predictions are anonymous.
          </p>
        </motion.section>

        {/* Section 2: How We Use Your Data */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            2. How We Use Your Data
          </h2>
          
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            We use the collected information for the following purposes:
          </p>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li><strong>Generate Predictions:</strong> Process your business data through our Random Forest machine learning model to predict success probability</li>
            <li><strong>Provide SHAP Explanations:</strong> Deliver transparent, interpretable insights about factors influencing your prediction</li>
            <li><strong>Model Improvement:</strong> Use anonymized data to retrain and enhance model accuracy</li>
            <li><strong>Analytics:</strong> Understand usage patterns to improve user experience</li>
            <li><strong>Research:</strong> Conduct aggregated statistical analysis on SME success factors in Rwanda</li>
            <li><strong>Service Optimization:</strong> Monitor performance and troubleshoot technical issues</li>
          </ul>
        </motion.section>

        {/* Section 3: Data Storage & Security */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            3. Data Storage & Security
          </h2>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Where Your Data is Stored
          </h3>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li>API Backend: Hosted on Render.com cloud infrastructure (https://smes-predictor-final.onrender.com)</li>
            <li>Server Location: United States data centers with enterprise-grade security</li>
            <li>Model Files: Stored securely on our backend servers</li>
          </ul>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Data Retention
          </h3>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li><strong>Prediction Data:</strong> Session-based, not permanently stored with user identification</li>
            <li><strong>Anonymized Analytics:</strong> Retained for model improvement purposes</li>
            <li><strong>Technical Logs:</strong> Retained for 90 days for troubleshooting and security monitoring</li>
          </ul>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Security Measures
          </h3>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li><strong>HTTPS Encryption:</strong> All data transmission encrypted using TLS/SSL protocols</li>
            <li><strong>Secure API Endpoints:</strong> Backend API protected with CORS policies and request validation</li>
            <li><strong>No Data Selling:</strong> We never sell, rent, or trade your business data to third parties</li>
            <li><strong>Access Controls:</strong> Restricted access to backend infrastructure</li>
          </ul>

          <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#64748b', marginTop: '20px', fontStyle: 'italic' }}>
            While we implement industry-standard security measures, no method of transmission over the internet or 
            electronic storage is 100% secure. We strive to protect your data but cannot guarantee absolute security.
          </p>
        </motion.section>

        {/* Section 4: AI Model & Predictions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            4. AI Model & Machine Learning
          </h2>
          
          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            How Predictions Work
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            Our Random Forest machine learning model was trained on historical data from thousands of Rwandan SMEs. 
            When you submit business information, the model:
          </p>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li>Analyzes your input data against learned patterns from successful and unsuccessful businesses</li>
            <li>Generates a success probability percentage (0-100%)</li>
            <li>Provides SHAP (SHapley Additive exPlanations) values explaining which factors most influenced the prediction</li>
            <li>Offers actionable recommendations based on similar successful businesses</li>
          </ul>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Model Training & Improvement
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            We periodically retrain our model using anonymized, aggregated data to improve accuracy. Your individual 
            business data may be used in anonymized form for model training, but cannot be traced back to you.
          </p>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Important Disclaimers
          </h3>
          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '10px',
            padding: '20px',
            marginTop: '15px'
          }}>
            <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#78350f', marginBottom: '10px' }}>
              <strong>⚠️ Not Financial or Legal Advice:</strong> SME Predictor predictions are for informational purposes 
              only and should not be considered as financial, legal, or professional business advice.
            </p>
            <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#78350f', marginBottom: '10px' }}>
              <strong>⚠️ Model Limitations:</strong> Our model achieves 85%+ accuracy but cannot account for all factors 
              affecting business success, including market changes, economic conditions, or individual execution quality.
            </p>
            <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#78350f' }}>
              <strong>⚠️ User Responsibility:</strong> You are solely responsible for your business decisions. Always 
              consult with qualified professionals before making significant business or financial decisions.
            </p>
          </div>
        </motion.section>

        {/* Section 5: Cookies & Tracking */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            5. Cookies & Local Storage
          </h2>
          
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            SME Predictor uses minimal cookies and browser storage:
          </p>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li><strong>Session Management:</strong> Temporary cookies to maintain your session while using the application</li>
            <li><strong>Preference Storage:</strong> Local storage to remember your form inputs during active use</li>
            <li><strong>No Third-Party Tracking:</strong> We do not use advertising cookies or third-party tracking pixels</li>
          </ul>

          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginTop: '20px' }}>
            You can disable cookies in your browser settings, but this may affect the functionality of SME Predictor.
          </p>
        </motion.section>

        {/* Section 6: Third-Party Services */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            6. Third-Party Services
          </h2>
          
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            SME Predictor uses the following third-party services:
          </p>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li><strong>Render.com:</strong> Cloud hosting for our backend API. View their privacy policy at <a href="https://render.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a' }}>https://render.com/privacy</a></li>
            <li><strong>External Links:</strong> Our Resources page contains links to Amazon (book purchases) and educational platforms (Coursera, Y Combinator, MIT, Google). We are not responsible for the privacy practices of these external sites.</li>
          </ul>

          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginTop: '20px' }}>
            We encourage you to review the privacy policies of any third-party services you access through our platform.
          </p>
        </motion.section>

        {/* Section 7: User Rights */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            7. Your Privacy Rights
          </h2>
          
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            You have the following rights regarding your data:
          </p>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569', marginBottom: '20px' }}>
            <li><strong>Access:</strong> Since we don't store personal identifiers, predictions are anonymous and cannot be retrieved after your session ends</li>
            <li><strong>Deletion:</strong> Session data is automatically cleared when you close your browser</li>
            <li><strong>Opt-Out:</strong> You can stop using SME Predictor at any time</li>
            <li><strong>Questions:</strong> Contact us for any privacy-related inquiries</li>
          </ul>

          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155' }}>
            For privacy concerns or data requests, please contact us at: <strong style={{ color: '#1e3a8a' }}>privacy@smepredictor.com</strong>
          </p>
        </motion.section>

        {/* Section 8: Legal Compliance */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            8. Legal Compliance
          </h2>
          
          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Rwanda Data Protection Laws
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            SME Predictor complies with the Law N° 058/2021 relating to the protection of personal data and privacy 
            in Rwanda. Our minimal data collection approach aligns with data protection principles.
          </p>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            International Users
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            While SME Predictor is primarily designed for Rwandan businesses, users from other countries may access 
            the platform. By using our service, international users acknowledge that their data will be processed 
            in accordance with this privacy policy.
          </p>

          <h3 style={{ color: '#1e3a8a', marginTop: '20px', marginBottom: '15px', fontSize: '1.2rem' }}>
            Academic Research
          </h3>
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155' }}>
            This platform is an academic project. Anonymized, aggregated data may be used for research publications 
            and academic presentations. No individual business data will be disclosed.
          </p>
        </motion.section>

        {/* Section 9: Children's Privacy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            9. Children's Privacy
          </h2>
          
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155' }}>
            SME Predictor is intended for business professionals and entrepreneurs. We do not knowingly collect data 
            from individuals under the age of 18. If you are under 18, please do not use this service without parental 
            or guardian supervision.
          </p>
        </motion.section>

        {/* Section 10: Changes to Privacy Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            10. Changes to This Privacy Policy
          </h2>
          
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
            operational, or regulatory reasons. When we make changes:
          </p>
          <ul style={{ marginLeft: '30px', lineHeight: '1.8', color: '#475569' }}>
            <li>The "Last Updated" date at the top of this page will be revised</li>
            <li>Significant changes will be prominently announced on our homepage</li>
            <li>Continued use of SME Predictor after changes constitutes acceptance of the updated policy</li>
          </ul>

          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginTop: '20px' }}>
            We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
          </p>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          style={{
            background: '#e0e7ff',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            border: '1px solid #cbd5e1'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.6rem' }}>
            Contact Us
          </h2>
          
          <p style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155', marginBottom: '15px' }}>
            If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, 
            please contact us:
          </p>
          <div style={{ marginLeft: '20px', lineHeight: '2', color: '#334155' }}>
            <p><strong>Email:</strong> <a href="mailto:privacy@smepredictor.com" style={{ color: '#1e3a8a' }}>privacy@smepredictor.com</a></p>
            <p><strong>Project:</strong> SME Success Predictor for Rwanda</p>
            <p><strong>API Endpoint:</strong> <a href="https://smes-predictor-final.onrender.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a' }}>https://smes-predictor-final.onrender.com</a></p>
          </div>

          <p style={{ lineHeight: '1.8', fontSize: '0.95rem', color: '#475569', marginTop: '20px', fontStyle: 'italic' }}>
            We aim to respond to all privacy inquiries within 5 business days.
          </p>
        </motion.section>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.9rem' }}>
          <p>© 2025 SME Predictor. All rights reserved.</p>
          <p style={{ marginTop: '10px' }}>
            This is an academic research project for educational purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
