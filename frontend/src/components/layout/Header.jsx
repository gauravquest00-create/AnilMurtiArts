import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiPhone, FiMail, FiMapPin, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import SearchModal from '../common/SearchModal';
import logoImg from '../../assets/brand/anil-murti-art-logo.svg';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`site-header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container header-container">
          {/* Logo & Brand Identity */}
          <Link to="/" className="brand-logo-link" aria-label="Anil Murti Art Home">
            <img src={logoImg} alt="Anil Murti Art Official Logo" className="brand-logo-img" />
            <div className="brand-text-block">
              <span className="brand-name">ANIL MURTI ART</span>
              <span className="brand-tagline">MASTER MARBLE SCULPTORS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
              Home
            </NavLink>
            <NavLink to="/collections" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Collections
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Art & Heritage
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Contact
            </NavLink>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Search Button (Both Desktop & Mobile) */}
            <button
              className="action-icon-btn search-trigger-btn"
              onClick={() => setSearchOpen(true)}
              aria-label="Search Artworks"
              title="Search Artworks"
            >
              <FiSearch />
            </button>

            {/* Desktop WhatsApp CTA */}
            <a
              href={generateWhatsAppLink(null, 'Namaste Anil Murti Art, I would like to inquire about handcrafted marble idols.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp header-wa-btn"
              aria-label="Inquire on WhatsApp"
            >
              <FaWhatsapp className="btn-icon" />
              <span>Inquire</span>
            </a>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Slide-Over Navigation Drawer */}
      <div
        className={`mobile-drawer-overlay ${mobileMenuOpen ? 'drawer-active' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className={`mobile-nav-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Top Header */}
          <div className="drawer-header">
            <Link to="/" className="drawer-brand" onClick={() => setMobileMenuOpen(false)}>
              <img src={logoImg} alt="Anil Murti Art" className="drawer-logo" />
              <div>
                <span className="drawer-brand-title">ANIL MURTI ART</span>
                <span className="drawer-brand-sub">JAIPUR • HANDCRAFTED</span>
              </div>
            </Link>
            <button
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Navigation Menu"
            >
              <FiX />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <div className="drawer-nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
              end
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Home</span>
              <FiArrowRight className="drawer-link-arrow" />
            </NavLink>

            <NavLink
              to="/collections"
              className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Collections</span>
              <FiArrowRight className="drawer-link-arrow" />
            </NavLink>

            <NavLink
              to="/collections?type=premium"
              className="drawer-link drawer-link-highlight"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Royal Premium Series</span>
              <span className="drawer-badge">LUXURY</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Art & Heritage</span>
              <FiArrowRight className="drawer-link-arrow" />
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => `drawer-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Contact Showroom</span>
              <FiArrowRight className="drawer-link-arrow" />
            </NavLink>
          </div>

          {/* Quick Category Discovery */}
          <div className="drawer-section">
            <span className="drawer-section-heading">POPULAR CATEGORIES</span>
            <div className="drawer-cat-pills">
              <Link to="/collections?categorySlug=god-idols" onClick={() => setMobileMenuOpen(false)}>
                God Idols
              </Link>
              <Link to="/collections?categorySlug=human-marble-art" onClick={() => setMobileMenuOpen(false)}>
                Human Sculptures
              </Link>
              <Link to="/collections?categorySlug=custom-marble-art" onClick={() => setMobileMenuOpen(false)}>
                Temple Custom Art
              </Link>
            </div>
          </div>

          {/* WhatsApp Direct Action */}
          <div className="drawer-cta-wrapper">
            <a
              href={generateWhatsAppLink(null, 'Namaste Anil Murti Art, I would like to inquire about handcrafted marble idols.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp drawer-wa-btn"
            >
              <FaWhatsapp className="drawer-wa-icon" />
              <span>Chat with Artisan on WhatsApp</span>
            </a>
          </div>

          {/* Drawer Contact Details Footer */}
          <div className="drawer-footer-info">
            <div className="drawer-info-row">
              <FiMapPin className="drawer-info-icon" />
              <span>Moorti Mohalla, Jaipur, Rajasthan 302001</span>
            </div>
            <div className="drawer-info-row">
              <FiPhone className="drawer-info-icon" />
              <a href="tel:+919829034567">+91 98290 34567</a>
            </div>
            <div className="drawer-info-row">
              <FiMail className="drawer-info-icon" />
              <a href="mailto:contact@anilmurtiart.com">contact@anilmurtiart.com</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
