import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BetaBadge } from './BetaBadge';
import { Button } from './Button';
import { Menu, X } from 'lucide-react';
import logo from '../assets/LogoHColor.svg';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="Oveka AI Logo" className="navbar-logo" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-nav desktop-nav">
          <Link 
            to="/about" 
            className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/feedback" 
            className={`nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
          >
            Feedback
          </Link>
        </nav>

        <div className="navbar-actions desktop-actions">
          <BetaBadge className="navbar-badge" />
          <Button variant="primary" size="md" onClick={() => window.location.hash = '#/notes'} className="pill-btn">
            Try for Free
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-menu">
          <div className="container">
            <Link 
              to="/about" 
              className={`mobile-nav-link ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              About
            </Link>
            <Link 
              to="/feedback" 
              className={`mobile-nav-link ${location.pathname === '/feedback' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Feedback
            </Link>
            <Link 
              to="/notes" 
              className={`mobile-nav-link ${location.pathname === '/notes' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Try for Free
            </Link>
            <div className="mobile-nav-footer">
               <BetaBadge />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
