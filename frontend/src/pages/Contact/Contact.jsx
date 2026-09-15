import React, { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { createEnquiry } from '../../api/enquiryApi';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone / WhatsApp number.');
      return;
    }

    try {
      setLoading(true);
      await createEnquiry(formData);
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to submit contact message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-hero-section">
        <div className="container">
          <span className="contact-hero-sub">DIRECT ARTISAN INQUIRY</span>
          <h1 className="contact-hero-title">Contact Anil Murti Art</h1>
          <p className="contact-hero-desc">
            Visit our studio in Jaipur, Rajasthan, or connect with our curation team for worldwide shipments and custom deity commissions.
          </p>
        </div>
      </div>

      <div className="container contact-main-grid">
        {/* Contact Info Card */}
        <div className="contact-info-card">
          <h3 className="info-card-title">Studio & Showroom</h3>
          <ul className="info-list">
            <li>
              <FiMapPin className="info-icon" />
              <div>
                <strong>Sculpture Studio:</strong>
                <p>Moorti Mohalla, Khazane Walon Ka Rasta, Jaipur, Rajasthan 302001, India</p>
              </div>
            </li>
            <li>
              <FiPhone className="info-icon" />
              <div>
                <strong>Direct Calls:</strong>
                <p>+91 98290 12345 / +91 98290 67890</p>
              </div>
            </li>
            <li>
              <FiMail className="info-icon" />
              <div>
                <strong>Email:</strong>
                <p>contact@anilmurtiart.com</p>
              </div>
            </li>
            <li>
              <FiClock className="info-icon" />
              <div>
                <strong>Visiting Hours:</strong>
                <p>Monday to Saturday: 9:30 AM – 7:30 PM IST</p>
              </div>
            </li>
          </ul>

          <div className="contact-wa-box">
            <span className="wa-box-label">Instant Artisan Chat</span>
            <a
              href={generateWhatsAppLink(null, 'Namaste Anil Murti Art, I am inquiring from your website.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp wa-direct-btn"
            >
              <FaWhatsapp />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Contact Inquiry Form */}
        <div className="contact-form-card">
          <h3 className="form-card-title">Send a Direct Inquiry</h3>
          {error && <div className="contact-error-banner">{error}</div>}

          {success ? (
            <div className="contact-success-state">
              <FiCheckCircle className="success-icon" />
              <h4>Inquiry Received</h4>
              <p>Thank you for reaching out. Our team will connect with you on phone/WhatsApp within 24 hours.</p>
              <button
                onClick={() => setSuccess(false)}
                className="btn btn-secondary"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-actual-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98290 00000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Inquiry Details *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about the idol you are looking for, dimensions, marble preference, or destination..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary submit-contact-btn" disabled={loading}>
                {loading ? 'Submitting Message...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
