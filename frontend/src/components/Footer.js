import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaChartLine } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div style={{ backgroundColor: 'var(--color-primary-2)' }} className="p-2 rounded-lg">
                <FaChartLine className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white" style={{ fontFamily: 'Space Mono, monospace' }}>SME Predictor</span>
            </div>
            <p className="mb-4 max-w-md" style={{ 
              color: '#e2e8f0',
              fontFamily: 'Space Mono, monospace',
              fontWeight: 400,
              lineHeight: 1.6
            }}>
              Empowering Rwandan entrepreneurs with AI-driven business success predictions. 
              Make informed decisions with our advanced machine learning technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors" style={{ color: '#cbd5e1' }}>
                <FaFacebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" style={{ color: '#cbd5e1' }}>
                <FaTwitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" style={{ color: '#cbd5e1' }}>
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" style={{ color: '#cbd5e1' }}>
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white" style={{ fontFamily: 'Space Mono, monospace' }}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors" style={{ 
                  color: '#e2e8f0',
                  fontFamily: 'Space Mono, monospace'
                }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/predictor" className="hover:text-white transition-colors" style={{ 
                  color: '#e2e8f0',
                  fontFamily: 'Space Mono, monospace'
                }}>
                  Predictor
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors" style={{ 
                  color: '#e2e8f0',
                  fontFamily: 'Space Mono, monospace'
                }}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white" style={{ fontFamily: 'Space Mono, monospace' }}>Contact Info</h3>
            <ul className="space-y-2" style={{ 
              color: '#e2e8f0',
              fontFamily: 'Space Mono, monospace'
            }}>
              <li>Kigali, Rwanda</li>
              <li>+250 788 123 456</li>
              <li>info@smepredictor.rw</li>
              <li>www.smepredictor.rw</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center" style={{ borderTop: '1px solid #475569' }}>
          <p className="text-sm" style={{ 
            color: '#cbd5e1',
            fontFamily: 'Space Mono, monospace'
          }}>
            © 2025 SME Success Predictor. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm hover:text-white transition-colors" style={{ 
              color: '#cbd5e1',
              fontFamily: 'Space Mono, monospace'
            }}>
              Privacy Policy
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors" style={{ 
              color: '#cbd5e1',
              fontFamily: 'Space Mono, monospace'
            }}>
              Terms of Service
            </a>
            <a href="#" className="text-sm hover:text-white transition-colors" style={{ 
              color: '#cbd5e1',
              fontFamily: 'Space Mono, monospace'
            }}>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;