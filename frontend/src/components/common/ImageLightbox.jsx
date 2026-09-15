import React from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ImageLightbox.css';

const ImageLightbox = ({ isOpen, images, activeIndex, onClose, onIndexChange }) => {
  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[activeIndex] || images[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    onIndexChange((activeIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    onIndexChange((activeIndex + 1) % images.length);
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close-btn" onClick={onClose} aria-label="Close Lightbox">
        <FiX />
      </button>

      {images.length > 1 && (
        <>
          <button className="lightbox-nav-btn prev-btn" onClick={handlePrev} aria-label="Previous image">
            <FiChevronLeft />
          </button>
          <button className="lightbox-nav-btn next-btn" onClick={handleNext} aria-label="Next image">
            <FiChevronRight />
          </button>
        </>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={currentImage.url}
          alt={currentImage.alt || 'Marble Artwork Full View'}
          className="lightbox-image"
        />
        <div className="lightbox-counter">
          {activeIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageLightbox;
