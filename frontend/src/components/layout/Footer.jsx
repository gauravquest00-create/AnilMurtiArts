import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import logoImg from '../../assets/brand/anil-murti-art-logo.svg';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Col 1: Brand & Philosophy */}
        <div className="footer-col brand-col">
          <div className="footer-brand-header">
            <img src={logoImg} alt="Anil Murti Art" className="footer-logo" />
            <div>
              <h3 className="footer-brand-title">ANIL MURTI ART</h3>
              <span className="footer-brand-sub">JAIPUR MARBLE HERITAGE</span>
            </div>
          </div>
          <p className="footer-description">
            Preserving the sacred tradition of marble idol carving with pure Makrana and Vietnam marble, meticulously sculpted by generational master craftsmen.
          </p>
          <a
            href={generateWhatsAppLink(null)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp footer-wa-btn"
          >
            <FaWhatsapp />
            <span>Connect on WhatsApp</span>
          </a>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="footer-col">
          <h4 className="footer-col-title">Art Gallery</h4>
          <ul className="footer-nav-list">
            <li><Link to="/collections">All Collections</Link></li>
            <li><Link to="/collections?type=premium">Premium Idols</Link></li>
            <li><Link to="/collections?categorySlug=god-idols">Hindu Deities</Link></li>
            <li><Link to="/collections?categorySlug=custom-marble-art">Bespoke Sculptures</Link></li>
            <li><Link to="/about">Artisan Heritage</Link></li>
          </ul>
        </div>

        {/* Col 3: Studio & Contact */}
        <div className="footer-col contact-col">
          <h4 className="footer-col-title">Studio & Inquiries</h4>
          <ul className="footer-contact-list">
            <li>
              <FiMapPin className="contact-icon" />
              <span>AASHA SINGH COLONY, STATION ROAD, RAMGARH, ALWAR, Rajasthan - 301026</span>
            </li>
            <li>
              <FiPhone className="contact-icon" />
              <span>+91 72328 79421  /  +91 9649334152  </span>
            </li>
            <li>
              <FiMail className="contact-icon" />
              <span></span>
            </li>
            <li>
              <FiClock className="contact-icon" />
              <span>Mon – Sat: 9:30 AM – 7:30 PM IST</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="copyright-text">
            © {new Date().getFullYear()} Anil Murti Art. All Rights Reserved. Handcrafted Sacred Sculptures.
          </p>
		  <p>Made by           <a href="https://webcraft-woad.vercel.app/" class="webcraft">   WEBCRAFT</a></p>
          <div className="footer-cert-tags">
            <span className="cert-tag">100% Pure White Marble</span>
            <span className="cert-tag">Safe Worldwide Crating</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
