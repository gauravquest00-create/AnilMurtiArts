import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import './FloatingWhatsApp.css';

const FloatingWhatsApp = () => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className="floating-wa-wrapper" title="Chat with Master Sculptor on WhatsApp">
      <a
        href={generateWhatsAppLink(null, 'Namaste Anil Murti Art, I would like to inquire about handcrafted marble idols and custom temple artwork.')}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-wa-btn"
        aria-label="Direct WhatsApp Chat"
      >
        <span className="wa-pulse-ring"></span>
        <FaWhatsapp className="floating-wa-icon" />
        <span className="floating-wa-tooltip">Inquire on WhatsApp</span>
      </a>
    </div>
  );
};

export default FloatingWhatsApp;
