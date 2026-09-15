import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiChevronRight,
  FiMaximize2,
  FiShare2,
  FiCheck,
  FiShield,
  FiTruck,
  FiStar
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { getCollectionBySlug, getRelatedCollections } from '../../api/collectionApi';
import { createReview } from '../../api/reviewApi';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import CollectionCard from '../../components/common/CollectionCard';
import EnquiryModal from '../../components/common/EnquiryModal';
import ImageLightbox from '../../components/common/ImageLightbox';
import { DetailSkeleton } from '../../components/common/SkeletonLoader';
import './CollectionDetails.css';

const CollectionDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [collection, setCollection] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  // Review Form state
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '', city: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Share notification
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await getCollectionBySlug(slug);
        const col = res.data;
        setCollection(col);
        setActiveImageIndex(0);

        // Update Document SEO Title dynamically
        document.title = `${col.name} | Anil Murti Art Jaipur`;

        // Fetch related artworks
        const relRes = await getRelatedCollections(col._id);
        setRelated(relRes.data || []);
      } catch (err) {
        console.error('Error loading collection details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [slug]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!collection) {
    return (
      <div className="container not-found-block">
        <h2>Marble Artwork Not Found</h2>
        <p>The requested idol may have been archived or is currently not accessible.</p>
        <Link to="/collections" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const images = collection.images && collection.images.length > 0 ? collection.images : [
    {
      url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      alt: collection.name
    }
  ];

  const currentImage = images[activeImageIndex] || images[0];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${collection.name} - Anil Murti Art`,
          text: `Check out this handcrafted marble murti: ${collection.name}`,
          url: window.location.href
        });
      } catch (err) {
        // Fallback to copy
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) return;

    try {
      setReviewSubmitting(true);
      await createReview({
        collectionId: collection._id,
        ...reviewForm
      });
      setReviewSuccess(true);
      setReviewForm({ name: '', rating: 5, comment: '', city: '' });
      // Refresh details
      const res = await getCollectionBySlug(slug);
      setCollection(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="collection-details-page">
      {/* Breadcrumb Bar */}
      <div className="breadcrumb-wrapper">
        <div className="container breadcrumb-container">
          <Link to="/">Home</Link>
          <FiChevronRight className="crumb-sep" />
          <Link to="/collections">Collections</Link>
          {collection.category && (
            <>
              <FiChevronRight className="crumb-sep" />
              <Link to={`/collections?categorySlug=${collection.category.slug}`}>
                {collection.category.name}
              </Link>
            </>
          )}
          <FiChevronRight className="crumb-sep" />
          <span className="crumb-active">{collection.name}</span>
        </div>
      </div>

      <div className="container details-main-grid">
        {/* Left Column: Gallery */}
        <div className="details-gallery-column">
          <div className="gallery-main-viewport">
            <img
              src={currentImage.url}
              alt={currentImage.alt || collection.name}
              className="gallery-main-img"
            />
            <button
              className="lightbox-trigger-btn"
              onClick={() => setIsLightboxOpen(true)}
              title="Expand Fullscreen View"
              aria-label="Expand image"
            >
              <FiMaximize2 />
            </button>

            {collection.salesBadge && (
              <span className="gallery-sales-badge badge badge-gold">
                {collection.salesBadge}
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {images.length > 1 && (
            <div className="gallery-thumbnails-row">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`gallery-thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img.url} alt={img.alt || `View ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Specs */}
        <div className="details-info-column">
          <div className="details-header-meta">
            {collection.godName && (
              <span className="detail-god-tag">{collection.godName}</span>
            )}
            {collection.collectionType === 'premium' && (
              <span className="badge badge-gold">ROYAL HERITAGE PIECE</span>
            )}
          </div>

          <h1 className="detail-title">{collection.name}</h1>

          {/* Primary Action Buttons */}
          <div className="detail-cta-block">
            <button
              className="btn btn-primary detail-enquire-btn"
              onClick={() => setIsEnquiryOpen(true)}
            >
              I'm Interested in this Artwork
            </button>

            <a
              href={generateWhatsAppLink(collection)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp detail-wa-btn"
            >
              <FaWhatsapp />
              <span>Direct WhatsApp Inquiry</span>
            </a>

            <button className="btn btn-secondary share-btn" onClick={handleShare}>
              <FiShare2 />
              <span>{copied ? 'Link Copied!' : 'Share Artwork'}</span>
            </button>
          </div>

          {/* Structured Specification Table */}
          <div className="specs-card">
            <h3 className="specs-card-title">Artwork Specifications</h3>
            <div className="specs-table">
              <div className="spec-row">
                <span className="spec-name">Primary Material</span>
                <span className="spec-value">{collection.material}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Total Height</span>
                <span className="spec-value">{collection.height}</span>
              </div>
              {(collection.baseWidth || collection.baseDepth) && (
                <div className="spec-row">
                  <span className="spec-name">Pedestal Dimensions</span>
                  <span className="spec-value">
                    {collection.baseWidth ? `${collection.baseWidth} Width` : ''}
                    {collection.baseWidth && collection.baseDepth ? ' × ' : ''}
                    {collection.baseDepth ? `${collection.baseDepth} Depth` : ''}{' '}
                    {collection.dimensionUnit || 'Inches'}
                  </span>
                </div>
              )}
              {collection.weight && (
                <div className="spec-row">
                  <span className="spec-name">Sculpture Weight</span>
                  <span className="spec-value">
                    {collection.weight} {collection.weightUnit || 'KG'} (Approx.)
                  </span>
                </div>
              )}
              <div className="spec-row">
                <span className="spec-name">Finishing & Painting</span>
                <span className="spec-value">{collection.painting || 'Natural Handcrafted Polish'}</span>
              </div>
              <div className="spec-row">
                <span className="spec-name">Artistry Origin</span>
                <span className="spec-value">Jaipur, Rajasthan, India</span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees Strip */}
          <div className="detail-trust-box">
            <div className="trust-mini-item">
              <FiShield className="trust-mini-icon" />
              <span>100% Genuine Certified Marble</span>
            </div>
            <div className="trust-mini-item">
              <FiTruck className="trust-mini-icon" />
              <span>Insured Heavy Wooden Crate Packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, About Deity, Care, Reviews */}
      <div className="container details-tabs-section">
        <div className="details-tabs-nav">
          <button
            className={`tab-nav-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Artwork Description
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About Deity & Iconography
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'care' ? 'active' : ''}`}
            onClick={() => setActiveTab('care')}
          >
            Marble Care Instructions
          </button>
          <button
            className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Client Reviews ({collection.reviews?.length || 0})
          </button>
        </div>

        <div className="tab-content-panel">
          {activeTab === 'description' && (
            <div className="tab-body-text">
              {collection.description ? (
                <p>{collection.description}</p>
              ) : (
                <p>
                  This exquisite marble idol of <strong>{collection.name}</strong> is meticulously sculpted by the master artisans at Anil Murti Art. Crafted from high-density pure marble, it exhibits refined anatomical symmetry, lifelike expressive facial features, and traditional ornamental embellishments.
                </p>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="tab-body-text">
              {collection.about ? (
                <p>{collection.about}</p>
              ) : (
                <p>
                  Rooted in ancient Vedic iconography and Shilpa Shastra scriptures, each idol embodies divine grace, poise, and sacred vibrations suitable for sanctum sanctorums, home mandirs, and cultural installations.
                </p>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="tab-body-text">
              <p>{collection.care}</p>
              <ul className="care-guidelines-list">
                <li>Dust regularly using a soft microfiber cloth or dry natural bristle brush.</li>
                <li>Avoid using harsh acidic detergents, lemon juice, or abrasive powders on marble.</li>
                <li>For sacred abhishekam, use mild water and pat dry with clean cotton cloth immediately.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-reviews-container">
              {collection.reviews && collection.reviews.length > 0 ? (
                <div className="reviews-list">
                  {collection.reviews.map((rev) => (
                    <div key={rev._id} className="review-card">
                      <div className="review-header">
                        <span className="review-author">{rev.name}</span>
                        {rev.city && <span className="review-city">({rev.city})</span>}
                        <div className="review-stars">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <FiStar key={i} className="star-filled" />
                          ))}
                        </div>
                      </div>
                      <p className="review-comment">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-reviews-text">No reviews yet for this masterpiece. Be the first to share your experience!</p>
              )}

              {/* Add Review Form */}
              <div className="add-review-section">
                <h4 className="add-review-title">Submit a Patron Review</h4>
                {reviewSuccess ? (
                  <p className="review-success-msg">Thank you! Your review has been submitted successfully.</p>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="review-form">
                    <div className="review-form-row">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                        required
                      />
                      <input
                        type="text"
                        placeholder="City / Country (e.g. Mumbai, USA)"
                        value={reviewForm.city}
                        onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                      />
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                      </select>
                    </div>
                    <textarea
                      rows="3"
                      placeholder="Share details about the idol carving, detailing, and delivery experience..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                    ></textarea>
                    <button type="submit" className="btn btn-secondary" disabled={reviewSubmitting}>
                      {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Collections */}
      {related.length > 0 && (
        <div className="container related-collections-section">
          <div className="section-header">
            <span className="section-subtitle">COMPLEMENTARY ART</span>
            <h2 className="section-title">Related Sculptures</h2>
          </div>
          <div className="collections-grid">
            {related.map((col) => (
              <CollectionCard
                key={col._id}
                collection={col}
                onEnquireClick={() => {
                  setCollection(col);
                  setIsEnquiryOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Component */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        images={images}
        activeIndex={activeImageIndex}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setActiveImageIndex}
      />

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        collection={collection}
      />
    </div>
  );
};

export default CollectionDetails;
