import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit2, FiBox } from 'react-icons/fi';
import { getAdminCategoryById } from '../../api/adminApi';
import './CategoryDetail.css';

const CategoryDetail = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndCollections = async () => {
      try {
        setLoading(true);
        const res = await getAdminCategoryById(id);
        setCategory(res.data.category);
        setCollections(res.data.collections || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryAndCollections();
  }, [id]);

  if (loading) {
    return <div className="admin-loading-state">Loading category details...</div>;
  }

  if (!category) {
    return (
      <div className="admin-empty-table-box">
        <h3>Category not found</h3>
        <Link to="/categories" className="admin-btn admin-btn-secondary">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-cat-detail-page">
      <div className="page-header-row">
        <Link to="/categories" className="back-link-btn">
          <FiArrowLeft />
          <span>Back to Categories</span>
        </Link>
        <Link to="/collections/create" className="admin-btn admin-btn-primary">
          <FiPlus />
          <span>Add Collection to this Category</span>
        </Link>
      </div>

      {/* Category Overview Card */}
      <div className="cat-summary-card">
        <img
          src={category.image?.url || 'https://via.placeholder.com/80'}
          alt={category.name}
          className="cat-summary-img"
        />
        <div className="cat-summary-text">
          <span className="cat-summary-sub">CATEGORY DETAILS</span>
          <h1 className="cat-summary-title">{category.name}</h1>
          <p className="cat-summary-desc">{category.description || 'No description provided.'}</p>
          <div className="cat-summary-chips">
            <span className="summary-chip">Slug: <code>{category.slug}</code></span>
            <span className="summary-chip">Total Linked Artworks: <strong>{collections.length}</strong></span>
            <span className={`admin-badge ${category.isLive ? 'admin-badge-live' : 'admin-badge-hidden'}`}>
              {category.isLive ? 'Live on Showroom' : 'Hidden'}
            </span>
          </div>
        </div>
      </div>

      {/* Linked Collections Grid */}
      <div className="linked-collections-section">
        <h2 className="section-subtitle-text">Linked Marble Artworks ({collections.length})</h2>

        {collections.length > 0 ? (
          <div className="linked-grid">
            {collections.map((col) => (
              <div key={col._id} className="linked-artwork-card">
                <img
                  src={col.images?.[0]?.url || 'https://via.placeholder.com/150'}
                  alt={col.name}
                  className="linked-thumb"
                />
                <div className="linked-card-body">
                  <h4 className="linked-name">{col.name}</h4>
                  <div className="linked-meta">
                    <span>{col.height}</span> • <span>{col.material}</span>
                  </div>
                  <div className="linked-status-row">
                    <span className={`admin-badge ${col.isLive ? 'admin-badge-live' : 'admin-badge-hidden'}`}>
                      {col.isLive ? 'Live' : 'Hidden'}
                    </span>
                    <Link to={`/collections/${col._id}/edit`} className="edit-mini-btn">
                      <FiEdit2 />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-empty-table-box">
            <FiBox style={{ fontSize: '32px', color: 'var(--gold-light)', marginBottom: '10px' }} />
            <h3>No collections linked yet</h3>
            <p>Assign marble artworks to this category when creating or editing collections.</p>
            <Link to="/collections/create" className="admin-btn admin-btn-primary">
              <FiPlus />
              <span>Add First Collection</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;
