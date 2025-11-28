import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FeedbackForm = ({ predictionType }) => {
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackMessage.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setFeedbackSubmitting(true);
    
    try {
      // Try local API first, then fallback to production
      let API_URL = 'http://localhost:8000';
      try {
        await fetch(`${API_URL}/health`, { method: 'HEAD', signal: AbortSignal.timeout(1000) });
      } catch {
        API_URL = 'https://smes-predictor-final.onrender.com';
      }
      
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: feedbackName || null,
          email: feedbackEmail || null,
          prediction_type: predictionType,
          message: feedbackMessage
        })
      });

      if (response.ok) {
        toast.success('Thank you for your feedback!');
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackMessage('');
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback error:', error);
      toast.error('Error submitting feedback');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div style={{
      marginTop: '30px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
      borderRadius: '20px',
      padding: '30px',
      border: '3px solid #3b82f6',
      boxShadow: '0 15px 40px rgba(59, 130, 246, 0.25)',
      overflow: 'hidden',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid rgba(59, 130, 246, 0.2)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white',
          borderRadius: '12px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
        }}>
          💬
        </div>
        <div>
          <h3 style={{
            color: '#1f2937',
            fontSize: '1.7rem',
            fontWeight: '700',
            margin: '0',
            background: 'linear-gradient(135deg, #1f2937, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Share Your Feedback
          </h3>
          <p style={{
            color: '#6b7280',
            fontSize: '0.95rem',
            margin: '5px 0 0 0',
            fontWeight: '500'
          }}>
            Help us improve! Share your thoughts about this prediction or any suggestions.
          </p>
        </div>
      </div>
      
      <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={feedbackName}
            onChange={(e) => setFeedbackName(e.target.value)}
            style={{
              padding: '14px 16px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              color: '#1f2937',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <input
            type="email"
            placeholder="Your email (optional)"
            value={feedbackEmail}
            onChange={(e) => setFeedbackEmail(e.target.value)}
            style={{
              padding: '14px 16px',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              color: '#1f2937',
              fontSize: '1rem',
              outline: 'none',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        
        <textarea
          placeholder="Share your feedback, comments, or suggestions..."
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          rows="4"
          maxLength="1000"
          required
          style={{
            width: '100%',
            padding: '14px 16px',
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            color: '#1f2937',
            fontSize: '1rem',
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease',
            fontWeight: '500',
            lineHeight: '1.6'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
          <span style={{ 
            fontSize: '0.9rem', 
            color: '#6b7280',
            fontWeight: '500'
          }}>
            {feedbackMessage.length}/1000 characters
          </span>
          <button
            type="submit"
            disabled={feedbackSubmitting}
            style={{
              padding: '14px 32px',
              background: feedbackSubmitting 
                ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: feedbackSubmitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: feedbackSubmitting 
                ? 'none'
                : '0 4px 15px rgba(59, 130, 246, 0.3)',
              letterSpacing: '0.5px'
            }}
            onMouseOver={(e) => {
              if (!feedbackSubmitting) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = feedbackSubmitting 
                ? 'none'
                : '0 4px 15px rgba(59, 130, 246, 0.3)';
            }}
          >
            {feedbackSubmitting ? 'Sending...' : 'Send Feedback'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
