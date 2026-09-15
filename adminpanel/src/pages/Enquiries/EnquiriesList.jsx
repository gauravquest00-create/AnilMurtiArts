import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiSearch,
  FiPhone,
  FiMail,
  FiTrash2,
  FiMessageSquare,
  FiExternalLink,
  FiX,
  FiCheckCircle,
  FiSave
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import {
  getAdminEnquiries,
  updateAdminEnquiry,
  deleteAdminEnquiry
} from '../../api/adminApi';
import ConfirmModal from '../../components/common/ConfirmModal';
import './EnquiriesList.css';

const EnquiriesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [enquiries, setEnquiries] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeStatus, setActiveStatus] = useState(searchParams.get('status') || 'All');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Detail Modal / Drawer state
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 15,
        status: activeStatus !== 'All' ? activeStatus : undefined
      };

      if (search.trim()) params.search = search.trim();

      const res = await getAdminEnquiries(params);
      setEnquiries(res.data || []);
      if (res.pagination) {
        setPagination(res.pagination);
        setStatusCounts(res.pagination.statusCounts || {});
      }
    } catch (err) {
      console.error(err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();

    const newParams = {};
    if (activeStatus !== 'All') newParams.status = activeStatus;
    if (search.trim()) newParams.search = search.trim();
    if (currentPage > 1) newParams.page = currentPage.toString();
    setSearchParams(newParams, { replace: true });
  }, [activeStatus, search, currentPage]);

  const openDetail = (enq) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.notes || '');
  };

  const handleUpdateStatusAndNotes = async () => {
    if (!selectedEnquiry) return;
    try {
      setSavingStatus(true);
      await updateAdminEnquiry(selectedEnquiry._id, {
        status: editStatus,
        notes: editNotes
      });
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      alert('Error updating enquiry: ' + err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const confirmDelete = (enq) => {
    setEnquiryToDelete(enq);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;
    try {
      setDeleting(true);
      await deleteAdminEnquiry(enquiryToDelete._id);
      setDeleteModalOpen(false);
      setEnquiryToDelete(null);
      fetchEnquiries();
    } catch (err) {
      alert('Error deleting enquiry: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const statuses = ['All', 'New', 'Contacted', 'In Progress', 'Converted', 'Closed'];

  return (
    <div className="admin-enquiries-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Customer Acquisition & Inquiries</h1>
          <p className="page-desc">Manage leads, track conversion pipeline, initiate direct WhatsApp dialogues & calls.</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="status-tabs-bar">
        {statuses.map((st) => (
          <button
            key={st}
            className={`status-tab-btn ${activeStatus === st ? 'active' : ''}`}
            onClick={() => {
              setActiveStatus(st);
              setCurrentPage(1);
            }}
          >
            <span>{st}</span>
            {statusCounts[st] !== undefined && (
              <span className="tab-count-pill">{statusCounts[st]}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search inquiries by customer name, phone, email, or artwork..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading-state">Loading customer inquiries...</div>
        ) : enquiries.length > 0 ? (
          <div className="table-responsive">
            <table className="admin-data-table full-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Target Artwork</th>
                  <th>Message Snippet</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enq) => (
                  <tr key={enq._id} onClick={() => openDetail(enq)} className="clickable-row">
                    <td>
                      <div className="customer-cell">
                        <strong>{enq.name}</strong>
                        <span>{enq.phone}</span>
                        {enq.email && <span className="email-sub">{enq.email}</span>}
                      </div>
                    </td>
                    <td>
                      {enq.collectionName ? (
                        <div className="cell-stack">
                          <strong>{enq.collectionName}</strong>
                          {enq.collectionSpecs && (
                            <span className="cell-sub">
                              {enq.collectionSpecs.material} • {enq.collectionSpecs.height}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-dim)' }}>General Studio Inquiry</span>
                      )}
                    </td>
                    <td>
                      <p className="enq-msg-preview">{enq.message || 'No additional custom note.'}</p>
                    </td>
                    <td>
                      <span className={`status-badge-pill status-pill-${enq.status.toLowerCase().replace(' ', '-')}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td>
                      <span className="enq-date-text">
                        {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                      <div className="table-action-group">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Namaste ${enq.name}, this is Anil Murti Art Jaipur regarding your inquiry for ${
                              enq.collectionName || 'handcrafted marble sculptures'
                            }. How may we assist you today?`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-link-btn wa-link"
                          title="Open WhatsApp Chat"
                        >
                          <FaWhatsapp />
                        </a>
                        <a
                          href={`tel:${enq.phone}`}
                          className="action-link-btn call-link"
                          title="Call Customer"
                        >
                          <FiPhone />
                        </a>
                        <button
                          onClick={() => confirmDelete(enq)}
                          className="action-link-btn delete-btn"
                          title="Delete Inquiry"
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
            <FiMessageSquare style={{ fontSize: '32px', color: 'var(--gold-light)', marginBottom: '10px' }} />
            <h3>No inquiries found</h3>
            <p>Inquiries submitted via the frontend "I'm Interested" modal will appear here.</p>
          </div>
        )}
      </div>

      {/* Detail & Status Update Drawer / Modal */}
      {selectedEnquiry && (
        <div className="admin-modal-overlay" onClick={() => setSelectedEnquiry(null)}>
          <div className="admin-modal-box enq-detail-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-flex">
              <div>
                <span className="modal-sub-label">INQUIRY DETAIL</span>
                <h3>{selectedEnquiry.name}</h3>
              </div>
              <button className="modal-x-btn" onClick={() => setSelectedEnquiry(null)}>
                <FiX />
              </button>
            </div>

            <div className="enq-detail-grid">
              <div className="detail-item">
                <span className="detail-label">Phone / WhatsApp</span>
                <strong className="detail-val">{selectedEnquiry.phone}</strong>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email</span>
                <span className="detail-val">{selectedEnquiry.email || 'Not provided'}</span>
              </div>
              <div className="detail-item full-col">
                <span className="detail-label">Inquired Artwork</span>
                <strong className="detail-val">{selectedEnquiry.collectionName || 'General Studio Inquiry'}</strong>
              </div>
              <div className="detail-item full-col">
                <span className="detail-label">Customer Message</span>
                <p className="detail-msg-box">{selectedEnquiry.message || 'No additional message provided.'}</p>
              </div>
            </div>

            <div className="enq-contact-shortcuts">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Namaste ${selectedEnquiry.name}, this is Anil Murti Art regarding your inquiry for ${
                    selectedEnquiry.collectionName || 'marble idols'
                  }.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-whatsapp"
              >
                <FaWhatsapp />
                <span>Open WhatsApp Dialogue</span>
              </a>
              <a href={`tel:${selectedEnquiry.phone}`} className="admin-btn admin-btn-secondary">
                <FiPhone />
                <span>Direct Call</span>
              </a>
            </div>

            {/* Pipeline Status & Admin Notes */}
            <div className="status-update-section">
              <div className="admin-form-field">
                <label>Pipeline Stage / Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="admin-select"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Converted">Converted (Order Placed)</option>
                  <option value="Closed">Closed / Inactive</option>
                </select>
              </div>

              <div className="admin-form-field" style={{ marginTop: '12px' }}>
                <label>Internal Administrator Notes</label>
                <textarea
                  rows="3"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Record customer discussion, quoted price, custom size requests..."
                ></textarea>
              </div>

              <div className="modal-actions-right" style={{ marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleUpdateStatusAndNotes}
                  className="admin-btn admin-btn-primary"
                  disabled={savingStatus}
                >
                  <FiSave />
                  <span>{savingStatus ? 'Saving...' : 'Update Lead Status'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Customer Inquiry"
        message={`Are you sure you want to delete the inquiry from ${enquiryToDelete?.name}?`}
        confirmLabel="Yes, Delete Inquiry"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        loading={deleting}
      />
    </div>
  );
};

export default EnquiriesList;
