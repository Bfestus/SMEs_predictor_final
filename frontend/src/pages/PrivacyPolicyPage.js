import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '40px 20px',
      fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '10px',
            color: '#1f2937',
            fontWeight: '700'
          }}>
            🔒 Privacy Policy
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>
            Last Updated: November 20, 2025
          </p>
        </div>

        {/* Main Content Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '50px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          {/* 1. Introduction */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              1. Introduction
            </h2>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '20px' }}>
              Welcome to the SME Success Predictor. We are committed to protecting your privacy and the confidentiality 
              of your business data. This Privacy Policy explains how we handle the information you provide when using 
              our web-based decision support tool.
            </p>
            <div style={{
              background: '#dbeafe',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '15px'
            }}>
              <p style={{ color: '#1e40af', fontWeight: '600', marginBottom: '8px' }}>
                🔒 Our Core Promise: Privacy-First & Stateless Architecture
              </p>
              <p style={{ color: '#1e3a8a', lineHeight: '1.6' }}>
                We operate on a "Privacy-First" and "Stateless" architecture. We do not require user registration, 
                we do not create user accounts, and we <strong>do not store the business data you input</strong> after 
                your prediction is generated.
              </p>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              2. Information We Collect
            </h2>
            
            <h3 style={{ color: '#374151', fontSize: '1.2rem', fontWeight: '600', marginTop: '25px', marginBottom: '15px' }}>
              2.1. Information You Provide Voluntarily
            </h3>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '15px' }}>
              To generate a success prediction and actionable recommendations, our tool asks for specific business fundamentals:
            </p>

            {/* Data Collection Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Data Category</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Specific Information</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Financial Data</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Business capital, 4-year revenue history, capital sources</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Revenue pattern analysis and growth prediction</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Operational Data</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>4-year employment history, number of employees</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Employment efficiency and scaling assessment</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Structural Data</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Business sector, entity type, district location</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Market context and sector-specific analysis</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Owner Demographics</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Owner age, education level, gender</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Leadership profile and experience assessment</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#78350f', fontWeight: '600' }}>
                ⚠️ Important: We do NOT collect Personally Identifiable Information (PII) such as your name, 
                email address, phone number, or Tax Identification Number (TIN).
              </p>
            </div>

            <h3 style={{ color: '#374151', fontSize: '1.2rem', fontWeight: '600', marginTop: '25px', marginBottom: '15px' }}>
              2.2. Automatically Collected Information
            </h3>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '10px' }}>
              Like most websites, our hosting providers (Vercel and Render.com) may automatically collect 
              standard server logs for security and performance monitoring:
            </p>
            <ul style={{ marginLeft: '30px', lineHeight: '1.7', color: '#374151' }}>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Time of access</li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              3. How We Use Your Information
            </h2>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '15px' }}>
              The data you input is used strictly for the following purposes:
            </p>

            {/* Data Usage Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Usage Purpose</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Description</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Data Retention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Real-Time Inference</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Your data is transmitted securely to our Machine Learning models (XGBoost and Random Forest) to calculate success probability</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '500' }}>Session only</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Explainability</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Generate SHAP (SHapley Additive exPlanations) values for personalized recommendations and risk assessments</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '500' }}>Session only</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>PDF Report Generation</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>If you choose to download a report, your browser uses current screen data to generate a PDF locally</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '500' }}>Local device only</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              background: '#ecfdf5',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '15px',
              marginTop: '15px'
            }}>
              <p style={{ color: '#059669', fontWeight: '600', marginBottom: '8px' }}>
                ✅ Real-Time Processing Only
              </p>
              <p style={{ color: '#065f46', lineHeight: '1.6' }}>
                Your business data is processed in real-time and discarded immediately after generating your prediction results. 
                We do not use your data for marketing, advertising, or any other purposes beyond providing your prediction.
              </p>
            </div>
          </section>

          {/* 4. Data Storage and Retention */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              4. Data Storage and Retention
            </h2>

            <div style={{
              background: '#fee2e2',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '1.1rem', marginBottom: '8px' }}>
                🚫 WE DO NOT STORE YOUR DATA
              </p>
              <p style={{ color: '#991b1b', lineHeight: '1.6' }}>
                This is our core architectural principle and competitive advantage.
              </p>
            </div>

            {/* Architecture Comparison Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Architecture Component</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Traditional Systems</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>SME Predictor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>User Accounts</td>
                    <td style={{ padding: '12px 16px', color: '#ef4444' }}>❌ Required registration</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a' }}>✅ No registration needed</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Database Storage</td>
                    <td style={{ padding: '12px 16px', color: '#ef4444' }}>❌ Permanent data storage</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a' }}>✅ No database - stateless</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Data Retention</td>
                    <td style={{ padding: '12px 16px', color: '#ef4444' }}>❌ Indefinite retention</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a' }}>✅ Session-based only</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Data Processing</td>
                    <td style={{ padding: '12px 16px', color: '#f59e0b' }}>⚠️ Stored then processed</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a' }}>✅ Real-time processing</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ color: '#374151', fontSize: '1.2rem', fontWeight: '600', marginTop: '25px', marginBottom: '15px' }}>
              Stateless Architecture Benefits
            </h3>
            <ul style={{ marginLeft: '30px', lineHeight: '1.7', color: '#374151' }}>
              <li><strong>Privacy by Design:</strong> No user data is stored, eliminating data breach risks</li>
              <li><strong>GDPR Compliance:</strong> Automatic compliance since no personal data is retained</li>
              <li><strong>Performance:</strong> Faster processing without database overhead</li>
              <li><strong>Security:</strong> No attack surface for stored data</li>
            </ul>
          </section>

          {/* 5. Third-Party Services */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              5. Third-Party Service Providers
            </h2>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '15px' }}>
              We use trusted third-party infrastructure to host our application. While we do not store data, 
              your data passes through their secure infrastructure:
            </p>

            {/* Third-Party Services Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Service Provider</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Purpose</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Data Handling</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Privacy Policy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Render.com</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Backend API and ML models hosting</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Temporary processing only</td>
                    <td style={{ padding: '12px 16px' }}><a href="https://render.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>View Policy</a></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Vercel</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Frontend user interface hosting</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Static files only</td>
                    <td style={{ padding: '12px 16px' }}><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>View Policy</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. Data Security */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              6. Data Security
            </h2>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '15px' }}>
              We implement robust security measures to protect your data during transmission:
            </p>

            {/* Security Measures Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Security Measure</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Implementation</th>
                    <th style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      borderBottom: '1px solid #e5e7eb'
                    }}>Protection Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Encryption</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>SSL/TLS (HTTPS) protocols for all data transmission</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '500' }}>Enterprise-grade</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>Input Sanitization</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>Strict validation to prevent malicious code injection</td>
                    <td style={{ padding: '12px 16px', color: '#16a34a', fontWeight: '500' }}>High</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 7. Cookies and Tracking */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              7. Cookies and Tracking
            </h2>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '15px' }}>
              We do not use tracking cookies or analytics services (like Google Analytics) to monitor your behavior. 
              We may use essential local storage on your browser solely to maintain the state of the input form while 
              you are using it. This data remains on your device.
            </p>
          </section>

          {/* 8. Your Rights */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              8. Your Rights
            </h2>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '15px' }}>
              Since we do not store your personal data, traditional rights such as "Right to be Forgotten" or 
              "Right to Access" are automatically fulfilled—there is no data for us to delete or provide because 
              we do not keep it. You have complete control over your data; simply closing the web page ensures 
              no record of your session remains with us.
            </p>
          </section>

          {/* 9. Contact Information */}
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '15px',
              borderBottom: '2px solid #3b82f6',
              paddingBottom: '8px',
              display: 'inline-block'
            }}>
              9. Contact Us
            </h2>
            <p style={{ lineHeight: '1.7', color: '#374151', fontSize: '1rem', marginBottom: '20px' }}>
              If you have any questions about this Privacy Policy or the technical architecture of the SME Success Predictor, 
              please contact the lead developer:
            </p>
            
            <div style={{ 
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '25px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ color: '#1f2937', fontSize: '1.2rem', fontWeight: '600', marginBottom: '5px' }}>
                  Festus BIGIRIMANA
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '5px' }}>
                  BSc. in Software Engineering
                </p>
                <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '15px' }}>
                  African Leadership University
                </p>
                <p style={{ color: '#374151', fontSize: '1rem' }}>
                  <strong>Email:</strong> 
                  <a href="mailto:f.bigirimana@alustudent.com" style={{ color: '#3b82f6', textDecoration: 'none', marginLeft: '8px' }}>
                    f.bigirimana@alustudent.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          color: '#6b7280', 
          fontSize: '0.9rem',
          marginTop: '30px'
        }}>
          <p style={{ marginBottom: '5px', fontWeight: '500' }}>
            © 2025 SME Success Predictor. All rights reserved.
          </p>
          <p style={{ opacity: '0.8' }}>
            This is an academic capstone project for educational purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
