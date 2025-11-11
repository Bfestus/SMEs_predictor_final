import React from 'react';
import { motion } from 'framer-motion';

// Import book cover images
import zeroToOneImg from '../assets/images/zero to one.png';
import eMythImg from '../assets/images/the e myth revisited.png';
import goodToGreatImg from '../assets/images/good to great.png';
import startupImg from '../assets/images/$100 start up.png';
import startWithWhyImg from '../assets/images/start with why.png';
import hardThingImg from '../assets/images/the hard things .png';
import thinkingFastImg from '../assets/images/thinking fast and slow.png';
import innovatorsDilemmaImg from '../assets/images/innovators dilemma.png';
import builtToLastImg from '../assets/images/build to last.png';

const ResourcesPage = () => {
  const businessBooks = [
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      description: "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
      link: "https://www.amazon.com/Lean-Startup-Entrepreneurs-Continuous-Innovation/dp/0307887898",
      image: "https://m.media-amazon.com/images/I/81-QB7nDh4L._SY466_.jpg" // Add image file to assets/images folder
    },
    {
      title: "Zero to One",
      author: "Peter Thiel",
      description: "Notes on startups, or how to build the future.",
      link: "https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296",
      image: zeroToOneImg
    },
    {
      title: "The E-Myth Revisited",
      author: "Michael E. Gerber",
      description: "Why most small businesses don't work and what to do about it.",
      link: "https://www.amazon.com/Myth-Revisited-Small-Businesses-About/dp/0887307280",
      image: eMythImg
    },
    {
      title: "Good to Great",
      author: "Jim Collins",
      description: "Why some companies make the leap and others don't.",
      link: "https://www.amazon.com/Good-Great-Some-Companies-Others/dp/0066620996",
      image: goodToGreatImg
    },
    {
      title: "The $100 Startup",
      author: "Chris Guillebeau",
      description: "Reinvent the way you make a living, do what you love, and create a new future.",
      link: "https://www.amazon.com/100-Startup-Reinvent-Living-Create/dp/0307951529",
      image: startupImg
    },
    {
      title: "Start with Why",
      author: "Simon Sinek",
      description: "How great leaders inspire everyone to take action.",
      link: "https://www.amazon.com/Start-Why-Leaders-Inspire-Everyone/dp/1591846447",
      image: startWithWhyImg
    },
    {
      title: "The Hard Thing About Hard Things",
      author: "Ben Horowitz",
      description: "Building a business when there are no easy answers.",
      link: "https://www.amazon.com/Hard-Thing-About-Things-Building/dp/0062273205",
      image: hardThingImg
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      description: "Essential reading for understanding decision-making in business.",
      link: "https://www.amazon.com/Thinking-Fast-Slow-Daniel-Kahneman/dp/0374533555",
      image: thinkingFastImg
    },
    {
      title: "The Innovator's Dilemma",
      author: "Clayton M. Christensen",
      description: "When new technologies cause great firms to fail.",
      link: "https://www.amazon.com/Innovators-Dilemma-Technologies-Management-Innovation/dp/1633691780",
      image: innovatorsDilemmaImg
    },
    {
      title: "Built to Last",
      author: "Jim Collins & Jerry I. Porras",
      description: "Successful habits of visionary companies.",
      link: "https://www.amazon.com/Built-Last-Successful-Visionary-Essentials/dp/0060516402",
      image: builtToLastImg
    }
  ];

  const professionalResources = [
    {
      title: "Rwanda Development Board (RDB)",
      description: "Official business registration and support services in Rwanda",
      link: "https://rdb.rw/",
      logo: "https://rdb.rw/fileadmin/user_upload/Documents/RDB_LOGO_.png"
    },
    {
      title: "International Finance Corporation (IFC)",
      description: "SME financing and business development resources",
      link: "https://www.ifc.org/",
      logo: "https://www.ifc.org/content/dam/ifc/logos/ifc-logo-red-2024.svg"
    },
    {
      title: "African Development Bank - SME Program",
      description: "Financial and technical support for African SMEs",
      link: "https://www.afdb.org/",
      logo: "https://www.afdb.org/sites/default/files/logo_192x192.png"
    },
    {
      title: "UNCTAD Entrepreneurship Policy Framework",
      description: "Policy guidance for SME development",
      link: "https://unctad.org/topic/enterprise-development",
      logo: "https://unctad.org/sites/default/files/unctad_logo_short_blue_0.png"
    },
    {
      title: "World Bank - Doing Business",
      description: "Business environment indicators and reports",
      link: "https://www.doingbusiness.org/",
      logo: "https://www.worldbank.org/content/dam/wbr/logo/logo-wb-header-en.svg"
    },
    {
      title: "Harvard Business Review",
      description: "Latest research and insights on business management",
      link: "https://hbr.org/",
      logo: "https://hbr.org/resources/images/hbr_logo_white.svg"
    }
  ];

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
            Resources & Learning Center
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.7, maxWidth: '800px', margin: '0 auto', color: '#475569' }}>
            Business books and professional organizations to help you grow your business
          </p>
        </motion.div>

        {/* Business Books Section */}
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
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '25px', fontSize: '1.8rem' }}>
            Top 10 Business Books for Entrepreneurs
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: '25px'
          }}>
            {businessBooks.map((book, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '1px solid #dbeafe',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.borderColor = '#1e3a8a';
                  e.currentTarget.style.background = '#e0e7ff';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(15, 23, 42, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img 
                  src={book.image} 
                  alt={book.title}
                  crossOrigin="anonymous"
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'contain',
                    marginBottom: '20px',
                    borderRadius: '10px',
                    backgroundColor: '#f1f5f9'
                  }}
                />
                <h3 style={{ color: '#0f172a', marginBottom: '10px', fontSize: '1.2rem' }}>
                  {book.title}
                </h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '5px', color: '#64748b' }}>
                  by {book.author}
                </p>
                <p style={{ fontSize: '0.95rem', marginBottom: '15px', lineHeight: '1.6', color: '#475569', flex: 1 }}>
                  {book.description}
                </p>
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    background: 'linear-gradient(45deg, #0f172a, #1e3a8a)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 5px 15px rgba(15, 23, 42, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  View Book
                </a>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Professional Resources */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background: 'white',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <h2 style={{ color: '#0f172a', marginBottom: '25px', fontSize: '1.8rem' }}>
            Professional Resources & Organizations
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '25px'
          }}>
            {professionalResources.map((resource, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  padding: '25px',
                  borderRadius: '15px',
                  border: '1px solid #cbd5e1',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#1e3a8a';
                  e.currentTarget.style.background = '#e0e7ff';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(15, 23, 42, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '100%',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  padding: '10px',
                  background: 'white',
                  borderRadius: '10px'
                }}>
                  <img 
                    src={resource.logo} 
                    alt={`${resource.title} logo`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '60px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <h3 style={{ color: '#0f172a', marginBottom: '15px', fontSize: '1.2rem' }}>
                  {resource.title}
                </h3>
                <p style={{ fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.6', color: '#475569' }}>
                  {resource.description}
                </p>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#0f172a',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#1e3a8a';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#0f172a';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  Visit Website →
                </a>
              </div>
            ))}
          </div>

          {/* Additional Learning Resources */}
          <div style={{ marginTop: '40px', padding: '30px', background: '#e0e7ff', borderRadius: '15px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ color: '#0f172a', marginBottom: '20px', fontSize: '1.3rem' }}>
              Additional Learning Platforms
            </h3>
            <ul style={{ lineHeight: '2', fontSize: '1rem', color: '#334155' }}>
              <li>
                <strong style={{ color: '#0f172a' }}>Coursera Business Strategy:</strong> Free courses from top universities
                <a href="https://www.coursera.org/browse/business" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a', marginLeft: '10px' }}>
                  Learn More →
                </a>
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>Y Combinator Startup School:</strong> Free online program for founders
                <a href="https://www.startupschool.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a', marginLeft: '10px' }}>
                  Learn More →
                </a>
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>MIT OpenCourseWare - Entrepreneurship:</strong> Free MIT courses
                <a href="https://ocw.mit.edu/courses/entrepreneurship/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a', marginLeft: '10px' }}>
                  Learn More →
                </a>
              </li>
              <li>
                <strong style={{ color: '#0f172a' }}>Google Digital Garage:</strong> Free digital skills training
                <a href="https://learndigital.withgoogle.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a8a', marginLeft: '10px' }}>
                  Learn More →
                </a>
              </li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ResourcesPage;
