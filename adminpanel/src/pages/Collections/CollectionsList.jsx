import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink
} from 'react-icons/fi';
import {
  getAdminCollections,
  updateAdminCollection,
  deleteAdminCollection
} from '../../api/adminApi';
import { getAdminCategories } from '../../api/adminApi';
import ConfirmModal from '../../components/common/ConfirmModal';
import './CollectionsList.css';

const CollectionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');
  const [liveFilter, setLiveFilter] = useState(searchParams.get('isLive') || '');
  const [featuredFilter, setFeaturedFilter] = useState(searchParams.get('isFeatured') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await getAdminCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        sort: 'newest'
      };

      if (search.trim()) params.search = search.trim();
      if (categoryFilter) params.category = categoryFilter;
      if (typeFilter) params.type = typeFilter;
      if (liveFilter !== '') params.isLive = liveFilter;
      if (featuredFilter !== '') params.featured = featuredFilter;

      const res = await getAdminCollections(params);
      setCollections(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
      setCollections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [search, categoryFilter, typeFilter, liveFilter, featuredFilter, currentPage]);

  const handleToggleLive = async (col) => {
    try {
      await updateAdminCollection(col._id, { isLive: !col.isLive });
      fetchCollections();
    } catch (err) {
      alert('Error updating live status: ' + err.message);
    }
  };

  const handleToggleFeatured = async (col) => {
    try {
      await updateAdminCollection(col._id, { isFeatured: !col.isFeatured });
      fetchCollections();
    } catch (err) {
      alert('Error updating featured status: ' + err.message);
    }
  };

  const confirmDelete = (col) => {
    setCollectionToDelete(col);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;
    try {
      setDeleting(true);
      await deleteAdminCollection(collectionToDelete._id);
      setDeleteModalOpen(false);
      setCollectionToDelete(null);
      fetchCollections();
    } catch (err) {
      alert('Error deleting collection: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-collections-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Marble Collection Portfolio</h1>
          <p className="page-desc">Manage artwork catalog, image galleries, dimensions, live & featured visibility.</p>
        </div>
        <Link to="/collections/create" className="admin-btn admin-btn-primary">
          <FiPlus />
          <span>Add New Collection</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search collections by deity or material..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="admin-select"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="admin-select"
        >
          <option value="">All Types (Regular & Premium)</option>
          <option value="premium">Premium Collection</option>
          <option value="regular">Regular Collection</option>
        </select>

        <select
          value={liveFilter}
          onChange={(e) => {
            setLiveFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="admin-select"
        >
          <option value="">Live Status: All</option>
          <option value="true">Live Only</option>
          <option value="false">Hidden / Drafts Only</option>
        </select>

        <select
          value={featuredFilter}
          onChange={(e) => {
            setFeaturedFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="admin-select"
        >
          <option value="">Featured: All</option>
          <option value="true">Featured On Homepage</option>
          <option value="false">Not Featured</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading-state">Loading collections...</div>
        ) : collections.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-data-table full-table">
              <thead>
                <tr>
                  <th>Artwork</th>
                  <th>Category / God</th>
                  <th>Specs (Height / Material)</th>
                  <th>Type</th>
                  <th>Featured</th>
                  <th>Live Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr key={col._id}>
                    <td>
                      <div className="table-artwork-info">
                        <img
                          src={col.images?.[0]?.url || 'https://via.placeholder.com/50'}
                          alt={col.name}
                          className="table-artwork-thumb"
                        />
                        <div>
                          <strong className="artwork-main-title">{col.name}</strong>
                          <span className="artwork-slug-preview">/collections/{col.slug}</span>
                          {col.salesBadge && (
                            <span className="admin-badge admin-badge-new" style={{ marginTop: '4px' }}>
                              {col.salesBadge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-stack">
                        <span>{col.category?.name || 'Unassigned'}</span>
                        {col.godName && <span className="cell-sub">{col.godName}</span>}
                      </div>
                    </td>
                    <td>
                      <div className="cell-stack">
                        <span>{col.height}</span>
                        <span className="cell-sub">{col.material}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge ${col.collectionType === 'premium' ? 'admin-badge-gold' : ''}`}>
                        {col.collectionType}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleFeatured(col)}
                        className={`toggle-star-btn ${col.isFeatured ? 'is-featured' : ''}`}
                        title={col.isFeatured ? 'Featured on Homepage' : 'Not Featured'}
                      >
                        <FiStar />
                        <span>{col.isFeatured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleLive(col)}
                        className={`admin-badge ${col.isLive ? 'admin-badge-live' : 'admin-badge-hidden'}`}
                        style={{ cursor: 'pointer' }}
                        title="Click to toggle Live/Hidden"
                      >
                        {col.isLive ? <FiEye /> : <FiEyeOff />}
                        <span>{col.isLive ? 'Live' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-action-group">
                        <a
                          href={`http://localhost:5173/collections/${col.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-link-btn"
                          title="Preview on Public Showroom"
                        >
                          <FiExternalLink />
                        </a>
                        <Link
                          to={`/collections/${col._id}/edit`}
                          className="action-link-btn"
                          title="Edit Collection"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => confirmDelete(col)}
                          className="action-link-btn delete-btn"
                          title="Delete Collection"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-table-box">
            <h3>No collections found</h3>
            <p>You haven't created any collections matching this query yet.</p>
            <Link to="/collections/create" className="admin-btn admin-btn-primary">
              <FiPlus />
              <span>Create First Collection</span>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-btn admin-btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <FiChevronLeft />
            <span>Previous</span>
          </button>
          <span>
            Page {currentPage} of {pagination.totalPages} ({pagination.total} items)
          </span>
          <button
            className="admin-btn admin-btn-secondary"
            disabled={currentPage >= pagination.totalPages}
            onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
          >
            <span>Next</span>
            <FiChevronRight />
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Collection Artwork"
        message={`Are you sure you want to permanently delete "${collectionToDelete?.name}"? All associated images will also be cleaned up from Cloudinary.`}
        confirmLabel="Yes, Delete Collection"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};

export default CollectionsList;
