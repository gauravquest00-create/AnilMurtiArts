import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiUploadCloud,
  FiTrash2,
  FiCheck,
  FiStar,
  FiSave,
  FiImage
} from 'react-icons/fi';
import {
  createAdminCollection,
  getAdminCollectionById,
  updateAdminCollection,
  getAdminCategories,
  uploadImagesToCloudinary,
  deleteImageFromCloudinary
} from '../../api/adminApi';
import './CollectionForm.css';

const CollectionForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    godName: '',
    height: '15 Inches',
    baseWidth: '',
    baseDepth: '',
    dimensionUnit: 'Inches',
    weight: '',
    weightUnit: 'KG',
    material: 'White Makrana Marble',
    painting: '24K Gold Foil & Natural Colors',
    collectionType: 'regular',
    isFeatured: false,
    isLive: true,
    salesBadge: '',
    description: '',
    about: '',
    care: 'Clean with a soft dry cloth. Avoid acidic cleaners or harsh chemical detergents. Handle with care during relocation.',
    images: []
  });

  useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const catRes = await getAdminCategories();
        setCategories(catRes.data || []);

        if (isEdit) {
          const colRes = await getAdminCollectionById(id);
          const col = colRes.data;
          setFormData({
            name: col.name || '',
            category: col.category?._id || col.category || '',
            godName: col.godName || '',
            height: col.height || '',
            baseWidth: col.baseWidth || '',
            baseDepth: col.baseDepth || '',
            dimensionUnit: col.dimensionUnit || 'Inches',
            weight: col.weight || '',
            weightUnit: col.weightUnit || 'KG',
            material: col.material || 'White Makrana Marble',
            painting: col.painting || '24K Gold Foil & Natural Colors',
            collectionType: col.collectionType || 'regular',
            isFeatured: Boolean(col.isFeatured),
            isLive: Boolean(col.isLive),
            salesBadge: col.salesBadge || '',
            description: col.description || '',
            about: col.about || '',
            care: col.care || '',
            images: col.images || []
          });
        }
      } catch (err) {
        setError(err.message || 'Error initializing collection form');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Image Upload to Cloudinary Handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      setError('');
      const data = new FormData();
      files.forEach((file) => {
        data.append('images', file);
      });
      data.append('folder', 'anil-murti-art/collections');
      data.append('alt', formData.name || 'Anil Murti Art Artwork');

      const res = await uploadImagesToCloudinary(data);
      const newUploaded = res.data || [];

      // Append to images list
      setFormData((prev) => {
        const existing = [...prev.images];
        const combined = [...existing, ...newUploaded];
        // Ensure at least one image is primary
        if (combined.length > 0 && !combined.some((img) => img.isPrimary)) {
          combined[0].isPrimary = true;
        }
        return { ...prev, images: combined };
      });
    } catch (err) {
      setError('Cloudinary Image Upload Failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimaryImage = (index) => {
    setFormData((prev) => {
      const updated = prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }));
      return { ...prev, images: updated };
    });
  };

  const handleRemoveImage = async (index) => {
    const targetImage = formData.images[index];
    if (targetImage.publicId) {
      try {
        await deleteImageFromCloudinary(targetImage.publicId);
      } catch (err) {
        console.warn('Cloudinary delete error:', err);
      }
    }

    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return { ...prev, images: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please provide a collection artwork name.');
      return;
    }
    if (!formData.category) {
      setError('Please select a category.');
      return;
    }
    if (!formData.height.trim()) {
      setError('Please provide height specifications.');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateAdminCollection(id, formData);
      } else {
        await createAdminCollection(formData);
      }
      navigate('/collections');
    } catch (err) {
      setError(err.message || 'Failed to save collection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-collection-form-page">
      <div className="form-header-bar">
        <Link to="/collections" className="back-link-btn">
          <FiArrowLeft />
          <span>Back to Collections</span>
        </Link>
        <h1 className="form-page-title">
          {isEdit ? `Edit Collection: ${formData.name}` : 'Add New Marble Collection'}
        </h1>
      </div>

      {error && <div className="admin-form-error-banner">{error}</div>}

      <form onSubmit={handleSubmit} className="collection-main-form">
        {/* Section 1: Basic Information */}
        <div className="form-section-card">
          <h3 className="section-card-heading">1. Basic Artwork Information</h3>
          <div className="form-grid-2">
            <div className="admin-form-field">
              <label>Artwork Title / Deity Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Durga Marble Idol"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-form-field">
              <label>God / Entity Name (Optional)</label>
              <input
                type="text"
                name="godName"
                value={formData.godName}
                onChange={handleChange}
                placeholder="e.g. Durga, Ganesha, Krishna"
              />
            </div>

            <div className="admin-form-field">
              <label>Sales Badge (Optional)</label>
              <select
                name="salesBadge"
                value={formData.salesBadge}
                onChange={handleChange}
              >
                <option value="">No Badge</option>
                <option value="NEW">NEW</option>
                <option value="EXCLUSIVE">EXCLUSIVE</option>
                <option value="PRE-ORDER">PRE-ORDER</option>
                <option value="LIMITED">LIMITED</option>
                <option value="CUSTOM">CUSTOM</option>
                <option value="SOLD OUT">SOLD OUT</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Specifications */}
        <div className="form-section-card">
          <h3 className="section-card-heading">2. Physical Specifications</h3>
          <div className="form-grid-3">
            <div className="admin-form-field">
              <label>Total Height *</label>
              <input
                type="text"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 15 Inches or 3.5 Feet"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Base Width</label>
              <input
                type="number"
                step="0.1"
                name="baseWidth"
                value={formData.baseWidth}
                onChange={handleChange}
                placeholder="e.g. 12.5"
              />
            </div>

            <div className="admin-form-field">
              <label>Base Depth</label>
              <input
                type="number"
                step="0.1"
                name="baseDepth"
                value={formData.baseDepth}
                onChange={handleChange}
                placeholder="e.g. 5.0"
              />
            </div>

            <div className="admin-form-field">
              <label>Approximate Weight</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 12.5"
              />
            </div>

            <div className="admin-form-field">
              <label>Marble Material *</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                placeholder="e.g. White Makrana Marble"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Finishing & Painting</label>
              <input
                type="text"
                name="painting"
                value={formData.painting}
                onChange={handleChange}
                placeholder="e.g. 24K Gold Foil & Natural Colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Collection Settings */}
        <div className="form-section-card">
          <h3 className="section-card-heading">3. Catalog & Visibility Settings</h3>
          <div className="settings-toggles-grid">
            <div className="admin-form-field">
              <label>Collection Tier / Type</label>
              <select
                name="collectionType"
                value={formData.collectionType}
                onChange={handleChange}
              >
                <option value="regular">Regular Collection</option>
                <option value="premium">Premium Royal Collection</option>
              </select>
            </div>

            <div className="checkbox-toggle-card">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <label htmlFor="isFeatured">
                <strong>Homepage Featured (ON/OFF)</strong>
                <span>When enabled, this artwork appears in the homepage Featured Masterpieces section.</span>
              </label>
            </div>

            <div className="checkbox-toggle-card">
              <input
                type="checkbox"
                id="isLive"
                name="isLive"
                checked={formData.isLive}
                onChange={handleChange}
              />
              <label htmlFor="isLive">
                <strong>Live Showroom Status (ON/OFF)</strong>
                <span>When OFF, this artwork is completely hidden from the public website.</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Image Management with Cloudinary */}
        <div className="form-section-card">
          <div className="section-card-header-flex">
            <h3 className="section-card-heading">4. Multi-Image Gallery (Cloudinary Hosted)</h3>
            <span className="image-count-tag">{formData.images.length} Images Attached</span>
          </div>

          <div className="image-uploader-zone">
            <label className="upload-dropzone">
              <FiUploadCloud className="upload-cloud-icon" />
              <span className="upload-prompt-main">Click to select artwork photos</span>
              <span className="upload-prompt-sub">Direct high-speed upload to Cloudinary (JPEG, PNG, WEBP)</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            {uploading && <div className="uploading-progress-msg">Uploading images to Cloudinary...</div>}
          </div>

          {formData.images.length > 0 && (
            <div className="images-preview-grid">
              {formData.images.map((img, idx) => (
                <div key={idx} className={`image-preview-tile ${img.isPrimary ? 'primary-tile' : ''}`}>
                  <img src={img.url} alt={img.alt || `Artwork ${idx + 1}`} />
                  <div className="tile-overlay-actions">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryImage(idx)}
                      className={`tile-btn ${img.isPrimary ? 'is-primary-btn' : ''}`}
                      title={img.isPrimary ? 'Primary Showcase Image' : 'Set as Primary'}
                    >
                      <FiStar />
                      <span>{img.isPrimary ? 'Primary' : 'Make Primary'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="tile-btn delete-tile-btn"
                      title="Remove Image"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Descriptions, About, Care */}
        <div className="form-section-card">
          <h3 className="section-card-heading">5. Descriptive Content & Sacred Context</h3>
          <div className="admin-form-field">
            <label>Artwork Description</label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of craftsmanship, features, and sculpture beauty..."
            ></textarea>
          </div>

          <div className="admin-form-field" style={{ marginTop: '16px' }}>
            <label>About Deity / Spiritual Background</label>
            <textarea
              name="about"
              rows="3"
              value={formData.about}
              onChange={handleChange}
              placeholder="Vedic context, significance of posture/mudra, temple blessings..."
            ></textarea>
          </div>

          <div className="admin-form-field" style={{ marginTop: '16px' }}>
            <label>Marble Care & Longevity Guidelines</label>
            <textarea
              name="care"
              rows="3"
              value={formData.care}
              onChange={handleChange}
              placeholder="Instructions for cleaning and preserving marble polish..."
            ></textarea>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="form-submit-row">
          <button type="button" onClick={() => navigate('/collections')} className="admin-btn admin-btn-secondary">
            Cancel
          </button>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading || uploading}>
            <FiSave />
            <span>{loading ? 'Saving...' : isEdit ? 'Update Collection' : 'Save & Publish Collection'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;
