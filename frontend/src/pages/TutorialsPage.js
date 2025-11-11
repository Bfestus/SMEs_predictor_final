import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TutorialsPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace",
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      color: '#1e293b',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            Tutorials & How It Works
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: '800px', margin: '0 auto', color: '#475569' }}>
            Learn how our AI-powered prediction system works and how to interpret your results
          </p>
        </motion.div>

        {/* How SME Predictor Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '25px', fontSize: '1.8rem' }}>
            How SME Predictor Works
          </h2>

          <div style={{ lineHeight: '1.8', fontSize: '1rem', color: '#334155' }}>
            <h3 style={{ color: '#1e3a8a', marginTop: '25px', marginBottom: '15px' }}>
              1. Data-Driven Machine Learning
            </h3>
            <p style={{ marginBottom: '15px' }}>
              Our system uses a Random Forest machine learning model trained on thousands of real SME cases from Rwanda. 
              The model achieves 85%+ accuracy by analyzing patterns in successful and unsuccessful businesses.
            </p>

            <h3 style={{ color: '#1e3a8a', marginTop: '25px', marginBottom: '15px' }}>
              2. Key Factors Analyzed
            </h3>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>Capital Adequacy (28% importance):</strong> Businesses with ≥10M RWF have 73% success rate</li>
              <li><strong>Business Sector (22% importance):</strong> ICT sector shows 89% success vs 51% in Agriculture</li>
              <li><strong>Location (18% importance):</strong> Urban areas (78% success) vs rural areas (56%)</li>
              <li><strong>Entity Type (15% importance):</strong> Limited Liability Companies (81%) vs Sole Proprietors (62%)</li>
              <li><strong>Capital Source (11% importance):</strong> Mixed funding sources show better outcomes</li>
              <li><strong>Revenue Growth (6% importance):</strong> Historical performance predicts future success</li>
            </ul>

            <h3 style={{ color: '#1e3a8a', marginTop: '25px', marginBottom: '15px' }}>
              3. SHAP Explainability
            </h3>
            <p style={{ marginBottom: '15px' }}>
              We use SHAP (SHapley Additive exPlanations) to provide transparent, interpretable predictions. 
              Instead of a "black box" result, you get:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Specific factors that influenced your prediction</li>
              <li>Actionable recommendations based on successful businesses</li>
              <li>Risk factors identified from failed businesses</li>
              <li>Business insights tailored to your situation</li>
            </ul>

            <h3 style={{ color: '#1e3a8a', marginTop: '25px', marginBottom: '15px' }}>
              4. Understanding Your Results
            </h3>
            
            <p style={{ marginBottom: '10px', marginTop: '20px' }}><strong style={{ color: '#0f172a' }}>For New Business Predictions:</strong></p>
            <p style={{ marginBottom: '10px' }}><strong>Success Probability:</strong></p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>80-100%: Strong likelihood of success - proceed with confidence</li>
              <li>60-79%: Good potential - address recommendations to improve odds</li>
              <li>40-59%: Moderate risk - significant changes needed</li>
              <li>Below 40%: High risk - reconsider core business fundamentals</li>
            </ul>

            <p style={{ marginBottom: '10px' }}><strong>Model Confidence:</strong></p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Above 70%: High confidence in prediction</li>
              <li>50-70%: Moderate confidence - consider multiple scenarios</li>
              <li>Below 50%: Low confidence - seek expert consultation</li>
            </ul>

            <p style={{ marginBottom: '10px', marginTop: '20px' }}><strong style={{ color: '#0f172a' }}>For Existing Business Predictions:</strong></p>
            <p style={{ marginBottom: '10px' }}>
              The model evaluates your business's historical performance data (revenue and employment over 4 years) 
              to predict future success probability:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>Revenue Growth Analysis:</strong> Positive year-over-year revenue trends significantly increase success probability. Consistent growth patterns (even modest) are better than erratic high-low swings.</li>
              <li><strong>Employment Trends:</strong> Steady employment growth or stability indicates operational maturity and sustainability. Declining employment often signals underlying challenges.</li>
              <li><strong>Combined Trajectory:</strong> The model weighs both metrics together. A business with growing revenue but shrinking workforce may face operational efficiency issues, while stable workforce with declining revenue suggests market challenges.</li>
              <li><strong>4-Year Pattern Recognition:</strong> The model identifies if your business is in growth phase, plateau phase, or decline phase based on the 4-year trajectory, comparing your pattern to thousands of successful/failed businesses.</li>
              <li><strong>Sector-Specific Benchmarks:</strong> Your historical performance is compared against similar businesses in your sector and location to determine if your growth is competitive.</li>
            </ul>

            <p style={{ marginBottom: '10px' }}><strong>What Your Existing Business Results Mean:</strong></p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li><strong>High Success Probability (70%+):</strong> Your historical data shows strong growth patterns. Focus on scaling and maintaining momentum.</li>
              <li><strong>Moderate Probability (50-69%):</strong> Your business is stable but may need strategic improvements. Review recommendations for growth opportunities.</li>
              <li><strong>Lower Probability (&lt;50%):</strong> Historical trends show concerning patterns. Consider pivoting strategy, seeking additional capital, or operational restructuring.</li>
            </ul>

            <p style={{ marginBottom: '15px', fontStyle: 'italic', color: '#64748b' }}>
              <strong>Note:</strong> Past performance doesn't guarantee future results, but historical data provides valuable insights into business viability and trajectory.
            </p>

            <h3 style={{ color: '#1e3a8a', marginTop: '25px', marginBottom: '15px' }}>
              5. Using Predictions Effectively
            </h3>
            <p style={{ marginBottom: '15px' }}>
              <strong>✓ DO:</strong>
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Use predictions as one input in your decision-making process</li>
              <li>Focus on implementing the recommended actions</li>
              <li>Combine AI insights with market research and expert advice</li>
              <li>Track your business against the predicted trajectory</li>
            </ul>

            <p style={{ marginBottom: '15px' }}>
              <strong>✗ DON'T:</strong>
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Rely solely on AI predictions for critical decisions</li>
              <li>Ignore sector-specific expertise and local knowledge</li>
              <li>Expect the model to account for all external factors</li>
              <li>Use predictions as guarantees of success or failure</li>
            </ul>

            <h3 style={{ color: '#1e3a8a', marginTop: '25px', marginBottom: '15px' }}>
              6. Model Limitations
            </h3>
            <p style={{ marginBottom: '15px' }}>
              Our predictions are based on historical data and may not account for:
            </p>
            <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <li>Economic crises or policy changes</li>
              <li>Natural disasters or pandemics</li>
              <li>Founder experience and skills</li>
              <li>Market competition dynamics</li>
              <li>Product/service quality and innovation</li>
              <li>Customer satisfaction and retention</li>
            </ul>

            <div style={{
              background: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '10px',
              padding: '20px',
              marginTop: '30px'
            }}>
              <h4 style={{ color: '#92400e', marginBottom: '10px' }}>💡 Pro Tip</h4>
              <p style={{ color: '#78350f', margin: 0, lineHeight: '1.6' }}>
                The most successful entrepreneurs use our predictions as a starting point, not the final answer. 
                Combine AI insights with your industry expertise, market research, and professional consultation for the best results.
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div style={{ 
            marginTop: '40px', 
            textAlign: 'center',
            paddingTop: '30px',
            borderTop: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              color: '#0f172a', 
              marginBottom: '20px',
              fontSize: '1.3rem'
            }}>
              Ready to Predict Your Business Success?
            </h3>
            <p style={{ 
              color: '#64748b', 
              marginBottom: '25px',
              fontSize: '1rem'
            }}>
              Now that you understand how our AI works, try it with your business data
            </p>
            <button
              onClick={() => navigate('/predictor')}
              style={{
                background: 'linear-gradient(45deg, #1e3a8a, #0f172a)',
                color: 'white',
                padding: '15px 40px',
                borderRadius: '10px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontFamily: "'Space Mono', monospace"
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              Go to Predictor →
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default TutorialsPage;
