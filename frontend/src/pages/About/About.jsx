import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiHeart, FiShield, FiCompass } from 'react-icons/fi';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero-section">
        <div className="container">
          <span className="about-hero-sub">HERITAGE OF JAIPUR MARBLE SCULPTURE</span>
          <h1 className="about-hero-title">Preserving Sacred Artistry in Pure Stone</h1>
          <p className="about-hero-desc">
            For generations, Anil Murti Art has sculpted timeless deity idols and sanctum monuments, marrying divine spirituality with authentic Rajasthani craftsmanship.
          </p>
        </div>
      </div>

      <div className="container about-content-container">
        <div className="about-split-grid">
          <div className="about-text-col">
            <span className="col-sub">OUR SACRED LEGACY</span>
            <h2 className="col-title">Generations of Devotion and Chisel Discipline</h2>
            <p>
              Located in the heart of Jaipur's historic <em>Moorti Mohalla</em>, Anil Murti Art was founded on the singular principle of maintaining uncompromised sanctity in every idol sculpted.
            </p>
            <p>
              Our sculptors follow ancestral canonical guidelines from the <strong>Shilpa Shastra</strong> and <strong>Agama Shastras</strong>, ensuring that divine iconography, mudras, ornaments, and proportions are accurately represented for sacred temple worship and home sanctuaries.
            </p>
            <p>
              We source only authentic, unblemished <strong>Makrana A-Grade White Marble</strong> (the same historic marble used in world wonders) and premium crystalline Vietnam marble, guaranteeing centuries of durability without yellowing or structural fatigue.
            </p>
          </div>

          <div className="about-values-box">
            <div className="value-item">
              <FiAward className="value-icon" />
              <div>
                <h4 className="value-title">Purity of Marble</h4>
                <p className="value-desc">Single-block quarry-sourced flawless marble with natural calcite luster.</p>
              </div>
            </div>
            <div className="value-item">
              <FiHeart className="value-icon" />
              <div>
                <h4 className="value-title">Bespoke Devotional Customization</h4>
                <p className="value-desc">From 9-inch pooja idols to 15-foot monolithic grand temple consecrations.</p>
              </div>
            </div>
            <div className="value-item">
              <FiShield className="value-icon" />
              <div>
                <h4 className="value-title">24K Real Gold Embossing</h4>
                <p className="value-desc">Traditional gold leafing and natural mineral pigments for everlasting shine.</p>
              </div>
            </div>
            <div className="value-item">
              <FiCompass className="value-icon" />
              <div>
                <h4 className="value-title">Worldwide Sacred Shipping</h4>
                <p className="value-desc">Export-grade customized fumigated wooden crating ensuring safe arrival.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-cta-banner">
          <h3 className="cta-banner-title">Commission a Bespoke Marble Artwork</h3>
          <p className="cta-banner-desc">
            Consult directly with our master artisans for personalized temple idols, family deities, or custom decorative marble art.
          </p>
          <Link to="/contact" className="btn btn-primary">
            <span>Get in Touch with Master Sculptor</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
