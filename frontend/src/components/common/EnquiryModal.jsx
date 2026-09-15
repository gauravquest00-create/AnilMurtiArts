import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { createEnquiry } from '../../api/enquiryApi';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import './EnquiryModal.css';

const EnquiryModal = ({ isOpen, onClose, collection }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Lock body scroll and prevent background interaction whenever modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSuccess(false);
      setError('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide both your name and phone number.');
      return;
    }

    try {
      setLoading(true);
      await createEnquiry({
        ...formData,
        collectionId: collection?._id
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenWhatsAppDirectly = () => {
    const link = generateWhatsAppLink(collection, formData.message);
    window.open(link, '_blank');
    onClose();
  };

  const modalContent = (
    <div className="modal-overlay enquiry-modal-overlay" onClick={onClose}>
      <div className="modal-content enquiry-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <FiX />
        </button>

        {!success ? (
          <>
            <div className="modal-header">
              <span className="modal-sub">ARTWORK ACQUISITION</span>
              <h2 className="modal-title">Inquire About Masterpiece</h2>
              {collection && (
                <div className="enquiry-artwork-preview">
                  <span className="preview-label">Selected Idol:</span>
                  <strong className="preview-name">{collection.name}</strong>
                  <span className="preview-spec">
                    ({collection.material || 'Marble'}{collection.height ? `, ${collection.height}` : ''})
                  </span>
                </div>
              )}
            </div>

            {error && <div className="modal-error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="enquiry-form">
              <div className="form-group">
                <label htmlFor="enq-name">Your Full Name *</label>
                <input
                  type="text"
                  id="enq-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Sharma"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="enq-phone">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    id="enq-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98290 00000"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="enq-email">Email (Optional)</label>
                  <input
                    type="email"
                    id="enq-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="enq-message">Custom Requirement / Temple Details</label>
                <textarea
                  id="enq-message"
                  name="message"
                  rows="3"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Specify custom height, delivery destination, or gold work requirements..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary submit-enquiry-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <FiLoader className="spin-icon" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <span>Submit Official Inquiry</span>
                  )}
                </button>

                <div className="modal-or-divider">
                  <span>OR</span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenWhatsAppDirectly}
                  className="btn btn-whatsapp instant-wa-btn"
                >
                  <FaWhatsapp />
                  <span>Chat Instantly on WhatsApp</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="enquiry-success-view">
            <FiCheckCircle className="success-icon" />
            <h3 className="success-title">Inquiry Registered</h3>
            <p className="success-desc">
              Thank you for contacting Anil Murti Art. Our master sculpture advisory team will contact you shortly on <strong>{formData.phone}</strong>.
            </p>
            <button
              onClick={handleOpenWhatsAppDirectly}
              className="btn btn-whatsapp success-wa-btn"
            >
              <FaWhatsapp />
              <span>Continue on WhatsApp with Details</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default EnquiryModal;
