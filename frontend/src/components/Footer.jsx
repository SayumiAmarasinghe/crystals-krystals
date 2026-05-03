import React from 'react';
import '../footer.css'; 
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Left Section: Branding & Socials */}
        <div className="footer-left">
          
          <h2 className="footer-logo">
            Crystal's Krystals
          </h2>
          
          {/* Social Icons */}
          <div className="social-icons">
            {/* Instagram */}
            <a href="https://www.instagram.com/crystals.krystals/"target="_blank" rel="noreferrer" aria-label="Instagram" className="social-link">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            
            {/* TikTok */}
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="social-link">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                <path d="M15 15v-4a2 2 0 0 1 2-2h1"></path>
                <path d="M15 11c0 2 1.5 3.5 3.5 3.5" stroke="#00f2fe" opacity="0.8"></path>
                <path d="M15 11c0 2 1.5 3.5 3.5 3.5" stroke="#fe0050" opacity="0.8" style={{ transform: 'translate(-1px, 1px)' }}></path>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Section: Navigation & Copyright */}
        <div className="footer-right">
          <nav className="footer-nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact Us</Link>
          </nav>

          <div className="footer-copyright">
            <p>© 2026 - All Rights Reserved</p>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;