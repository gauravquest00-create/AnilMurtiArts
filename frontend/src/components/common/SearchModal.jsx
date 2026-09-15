import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi';
import { getCollections } from '../../api/collectionApi';
import './SearchModal.css';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSearchTerm('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await getCollections({ search: searchTerm, limit: 6 });
        setResults(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  const handleSelect = (slug) => {
    onClose();
    navigate(`/collections/${slug}`);
  };

  const handleFullSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onClose();
      navigate(`/collections?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const modalMarkup = (
    <div className="modal-overlay search-modal-overlay" onClick={onClose}>
      <div className="modal-content search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <form onSubmit={handleFullSearch} className="search-input-wrapper">
            <FiSearch className="search-bar-icon" />
            <input
              type="text"
              autoFocus
              placeholder="Search by deity name (Durga, Ganesha, Shiva), material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-main-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="clear-search-btn"
              >
                <FiX />
              </button>
            )}
          </form>
          <button className="search-close-btn" onClick={onClose} aria-label="Close search">
            <FiX />
          </button>
        </div>

        <div className="search-results-area">
          {loading ? (
            <div className="search-loading">Searching marble collections...</div>
          ) : results.length > 0 ? (
            <div className="search-results-list">
              {results.map((item) => (
                <div
                  key={item._id}
                  className="search-item-row"
                  onClick={() => handleSelect(item.slug)}
                >
                  <img
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100'}
                    alt={item.name}
                    className="search-item-thumb"
                  />
                  <div className="search-item-info">
                    <span className="search-item-title">{item.name}</span>
                    <span className="search-item-specs">
                      {item.godName ? `${item.godName} • ` : ''}
                      {item.material} • {item.height}
                    </span>
                  </div>
                  <FiArrowRight className="search-item-arrow" />
                </div>
              ))}
              <button onClick={handleFullSearch} className="view-all-results-btn">
                View all results for "{searchTerm}" →
              </button>
            </div>
          ) : searchTerm ? (
            <div className="search-no-results">
              No artworks found matching "{searchTerm}". Try searching "Durga", "Marble", or "Ganesha".
            </div>
          ) : (
            <div className="search-suggestions">
              <span className="sugg-title">Popular Inquiries:</span>
              <div className="sugg-chips">
                {['Durga', 'Ganesha', 'Radha Krishna', 'Shiva', 'White Makrana Marble', 'Ram Darbar'].map(
                  (tag) => (
                    <button
                      key={tag}
                      className="sugg-chip"
                      onClick={() => setSearchTerm(tag)}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalMarkup, document.body);
};

export default SearchModal;
