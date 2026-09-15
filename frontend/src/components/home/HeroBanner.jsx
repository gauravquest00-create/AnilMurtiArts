import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import logoImg from '../../assets/brand/anil-murti-art-logo.svg';
import './HeroBanner.css';

const HeroBanner = () => {
  return (
    <section className="hero-banner-section">
      <div className="hero-bg-overlay"></div>
      <div className="container hero-container">
        <div className="hero-badge-pill">
          <span className="pill-dot"></span>
          <span>ESTABLISHED MARBLE ARTISANS • JAIPUR</span>
        </div>

        <h1 className="hero-headline">
          Sacred Elegance in <br />
          <span className="gold-shimmer-text">Pure White Marble</span>
        </h1>

        <p className="hero-subtext">
          Generational master sculptors crafting authentic Hindu deity murtis, temple shrines, and bespoke marble masterpieces from 100% genuine Makrana & Vietnam marble.
        </p>

        <div className="hero-cta-group">
          <Link to="/collections" className="btn btn-primary hero-btn-main">
            <span>Explore Collections</span>
            <FiArrowRight />
          </Link>
          <a
            href={generateWhatsAppLink(null, 'Namaste Anil Murti Art, I would like to inquire about a custom bespoke marble idol.')}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary hero-btn-secondary"
          >
            <FaWhatsapp className="hero-btn-icon" />
            <span>Custom Idol Inquiry</span>
          </a>
        </div>

        <div className="hero-trust-pills">
          <div className="trust-pill-item">
            <FiCheckCircle className="pill-icon" />
            <span>100% Pure Makrana Marble</span>
          </div>
          <div className="trust-pill-item">
            <FiCheckCircle className="pill-icon" />
            <span>24K Genuine Gold Leaf Detailing</span>
          </div>
          <div className="trust-pill-item">
            <FiShield className="pill-icon" />
            <span>Zero-Damage Insured Global Transit</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
