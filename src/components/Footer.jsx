import React from 'react';
import { Link } from 'react-router-dom';
import { BetaBadge } from './BetaBadge';
import logo from '../assets/LogoHColor.svg';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo-wrapper">
          <img src={logo} alt="Oveka AI Large Logo" className="footer-large-logo" />
        </div>
        
        <div className="footer-content">
          <div className="footer-nav">
            <Link to="/about" className="footer-link">About</Link>
            <Link to="/feedback" className="footer-link">Feedback</Link>
            <Link to="/notes" className="footer-link footer-cta">Try for Free</Link>
          </div>
          
          <div className="footer-bottom">
            <BetaBadge className="footer-badge" />
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} Oveka AI. Built for smarter learning.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
