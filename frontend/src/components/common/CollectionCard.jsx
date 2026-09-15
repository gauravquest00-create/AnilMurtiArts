import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiEye } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import './CollectionCard.css';

const CollectionCard = ({ collection, onEnquireClick }) => {
  if (!collection) return null;

  const primaryImage =
    collection.images?.find((img) => img.isPrimary) ||
    collection.images?.[0] || {
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
      alt: collection.name
    };

  const getBadgeClass = (badge) => {
    switch (badge?.toUpperCase()) {
      case 'NEW':
        return 'badge-new';
      case 'EXCLUSIVE':
        return 'badge-exclusive';
      case 'PRE-ORDER':
        return 'badge-preorder';
      default:
        return 'badge-gold';
    }
  };

  const handleEnquiry = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnquireClick) {
      onEnquireClick(collection);
    } else {
      window.open(generateWhatsAppLink(collection), '_blank');
    }
  };

  return (
    <article className={`collection-card ${collection.collectionType === 'premium' ? 'premium-card' : ''}`}>
      {/* Media Image Container with compact height */}
      <div className="card-media-wrapper">
        <Link to={`/collections/${collection.slug}`} className="card-image-link" aria-label={`View ${collection.name}`}>
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || collection.name}
            className="card-image"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="card-badges">
          {collection.salesBadge && (
            <span className={`badge ${getBadgeClass(collection.salesBadge)}`}>
              {collection.salesBadge}
            </span>
          )}
          {collection.collectionType === 'premium' && (
            <span className="badge badge-gold">PREMIUM</span>
          )}
        </div>

        {/* Quick Actions Hover Overlay */}
        <div className="card-quick-actions">
          <Link
            to={`/collections/${collection.slug}`}
            className="quick-action-btn"
            title="View Details"
            aria-label={`View ${collection.name}`}
          >
            <FiEye />
          </Link>
          <button
            type="button"
            className="quick-action-btn wa-quick-btn"
            onClick={handleEnquiry}
            title="Inquire on WhatsApp"
            aria-label="Inquire on WhatsApp"
          >
            <FaWhatsapp />
          </button>
        </div>
      </div>

      {/* Card Body - Content & Specs */}
      <div className="card-content">
        <div className="card-meta-top">
          <span className="god-name-tag">
            {collection.godName || 'Sculpture'}
          </span>
          {collection.category?.name && (
            <span className="category-tag">{collection.category.name}</span>
          )}
        </div>

        <h3 className="card-title">
          <Link to={`/collections/${collection.slug}`}>{collection.name}</Link>
        </h3>

        {/* Structured Spec Chips (Height, Material, Finish) */}
        <div className="card-specs-container">
          {collection.height && (
            <div className="spec-chip">
              <span className="spec-chip-label">Ht:</span>
              <span className="spec-chip-val">{collection.height}</span>
            </div>
          )}
          {collection.material && (
            <div className="spec-chip">
              <span className="spec-chip-val">{collection.material}</span>
            </div>
          )}
          {collection.painting && (
            <div className="spec-chip">
              <span className="spec-chip-val">{collection.painting}</span>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="card-footer">
          <button
            type="button"
            className="btn-card-enquire"
            onClick={handleEnquiry}
          >
            I'm Interested
          </button>

          <Link to={`/collections/${collection.slug}`} className="btn-card-details" aria-label={`Details of ${collection.name}`}>
            <span>View</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default CollectionCard;
