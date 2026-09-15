import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFolder,
  FiEye,
  FiEyeOff,
  FiUploadCloud,
  FiX,
  FiSave
} from 'react-icons/fi';
import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  uploadImagesToCloudinary
} from '../../api/adminApi';
import ConfirmModal from '../../components/common/ConfirmModal';
import './CategoriesList.css';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: { url: '', publicId: '' },
    isLive: true
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAdminCategories();
      setCategories(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: { url: '', publicId: '' },
      isLive: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || { url: '', publicId: '' },
      isLive: cat.isLive !== undefined ? cat.isLive : true
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append('images', file);
      data.append('folder', 'anil-murti-art/categories');
      const res = await uploadImagesToCloudinary(data);
      if (res.data && res.data.length > 0) {
        setFormData({
          ...formData,
          image: {
            url: res.data[0].url,
            publicId: res.data[0].publicId
          }
        });
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setSaving(true);
      if (editingCategory) {
        await updateAdminCategory(editingCategory._id, formData);
      } else {
        await createAdminCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (cat) => {
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      await deleteAdminCategory(categoryToDelete._id);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-categories-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Artwork Categories Taxonomy</h1>
          <p className="page-desc">Organize marble deity domains, linked collections, and category showcases.</p>
        </div>
        <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
          <FiPlus />
          <span>Add New Category</span>
        </button>
      </div>

      {error && <div className="admin-form-error-banner">{error}</div>}

      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading-state">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-data-table full-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Linked Collections</th>
                  <th>Visibility</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <div className="cat-cell-info">
                        <img
                          src={cat.image?.url || 'https://via.placeholder.com/40'}
                          alt={cat.name}
                          className="cat-cell-thumb"
                        />
                        <div>
                          <strong className="cat-name-text">{cat.name}</strong>
                          <span className="cat-desc-snippet">{cat.description || 'No description'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code>/collections?categorySlug={cat.slug}</code>
                    </td>
                    <td>
                      <Link to={`/categories/${cat._id}`} className="linked-count-badge">
                        <FiFolder />
                        <span>{cat.collectionCount || 0} Artworks</span>
                      </Link>
                    </td>
                    <td>
                      <span className={`admin-badge ${cat.isLive ? 'admin-badge-live' : 'admin-badge-hidden'}`}>
                        {cat.isLive ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-action-group">
                        <Link
                          to={`/categories/${cat._id}`}
                          className="action-link-btn"
                          title="View Linked Collections"
                        >
                          <FiFolder />
                        </Link>
                        <button
                          onClick={() => openEditModal(cat)}
                          className="action-link-btn"
                          title="Edit Category"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => confirmDelete(cat)}
                          className="action-link-btn delete-btn"
                          title="Delete Category"
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
            <h3>No categories found</h3>
            <p>Create your first category (e.g. God Idols, Human Marble Art, Temple Sculptures).</p>
            <button onClick={openCreateModal} className="admin-btn admin-btn-primary">
              <FiPlus />
              <span>Create First Category</span>
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box cat-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-flex">
              <h3>{editingCategory ? 'Edit Category' : 'Create New Category'}</h3>
              <button className="modal-x-btn" onClick={() => setIsModalOpen(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave} className="cat-form">
              <div className="admin-form-field">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. God Idols"
                  required
                />
              </div>

              <div className="admin-form-field">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for category showcase..."
                ></textarea>
              </div>

              <div className="admin-form-field">
                <label>Category Showcase Image (Cloudinary)</label>
                <div className="cat-img-upload-row">
                  {formData.image?.url && (
                    <img src={formData.image.url} alt="Preview" className="cat-img-preview" />
                  )}
                  <label className="admin-btn admin-btn-secondary upload-small-btn">
                    <FiUploadCloud />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              <div className="checkbox-toggle-card">
                <input
                  type="checkbox"
                  id="catLive"
                  checked={formData.isLive}
                  onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
                />
                <label htmlFor="catLive">
                  <strong>Live Category Status</strong>
                  <span>Visible in frontend navigation & filters</span>
                </label>
              </div>

              <div className="modal-actions-right">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving || uploading}
                >
                  <FiSave />
                  <span>{saving ? 'Saving...' : 'Save Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
        confirmLabel="Yes, Delete Category"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};

export default CategoriesList;
