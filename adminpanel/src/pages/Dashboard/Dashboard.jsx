import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiBox,
  FiEye,
  FiEyeOff,
  FiStar,
  FiAward,
  FiFolder,
  FiMessageSquare,
  FiPlus,
  FiArrowRight,
  FiPhone
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa6';
import { getDashboardMetrics, updateAdminEnquiry } from '../../api/adminApi';
import { generateWhatsAppLink } from '../../utils/whatsapp';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardMetrics();
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (enquiryId, newStatus) => {
    try {
      await updateAdminEnquiry(enquiryId, { status: newStatus });
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-dashboard-view">
      <div className="dashboard-page-header">
        <div>
          <h1 className="dash-title">Executive Dashboard</h1>
          <p className="dash-sub">Operational metrics and direct artwork catalog control.</p>
        </div>
        <div className="dash-top-actions">
          <Link to="/collections/create" className="admin-btn admin-btn-primary">
            <FiPlus />
            <span>Add Collection</span>
          </Link>
          <Link to="/categories" className="admin-btn admin-btn-secondary">
            <FiPlus />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* Clickable Stat Cards Grid */}
      <div className="dashboard-metrics-grid">
        {/* Total Collections */}
        <div
          className="metric-card"
          onClick={() => navigate('/collections')}
          title="Click to view all collections"
        >
          <div className="metric-card-header">
            <span className="metric-label">Total Collections</span>
            <div className="metric-icon-box gold-icon">
              <FiBox />
            </div>
          </div>
          <div className="metric-number">{stats?.totalCollections || 0}</div>
          <div className="metric-footer">
            <span>View All Artworks →</span>
          </div>
        </div>

        {/* Live Collections */}
        <div
          className="metric-card"
          onClick={() => navigate('/collections?isLive=true')}
          title="Click to view published collections"
        >
          <div className="metric-card-header">
            <span className="metric-label">Live / Visible</span>
            <div className="metric-icon-box green-icon">
              <FiEye />
            </div>
          </div>
          <div className="metric-number">{stats?.liveCollections || 0}</div>
          <div className="metric-footer">
            <span>Live on Showroom →</span>
          </div>
        </div>

        {/* Hidden Collections */}
        <div
          className="metric-card"
          onClick={() => navigate('/collections?isLive=false')}
          title="Click to view draft/hidden collections"
        >
          <div className="metric-card-header">
            <span className="metric-label">Hidden / Drafts</span>
            <div className="metric-icon-box dim-icon">
              <FiEyeOff />
            </div>
          </div>
          <div className="metric-number">{stats?.hiddenCollections || 0}</div>
          <div className="metric-footer">
            <span>Unpublished Works →</span>
          </div>
        </div>

        {/* Featured Collections */}
        <div
          className="metric-card"
          onClick={() => navigate('/collections?isFeatured=true')}
          title="Click to view homepage featured collections"
        >
          <div className="metric-card-header">
            <span className="metric-label">Featured Art</span>
            <div className="metric-icon-box gold-icon">
              <FiStar />
            </div>
          </div>
          <div className="metric-number">{stats?.featuredCollections || 0}</div>
          <div className="metric-footer">
            <span>Homepage Featured →</span>
          </div>
        </div>

        {/* Premium Collections */}
        <div
          className="metric-card"
          onClick={() => navigate('/collections?type=premium')}
          title="Click to view royal premium collections"
        >
          <div className="metric-card-header">
            <span className="metric-label">Premium Sculptures</span>
            <div className="metric-icon-box gold-icon">
              <FiAward />
            </div>
          </div>
          <div className="metric-number">{stats?.premiumCollections || 0}</div>
          <div className="metric-footer">
            <span>Royal Portfolio →</span>
          </div>
        </div>

        {/* Total Categories */}
        <div
          className="metric-card"
          onClick={() => navigate('/categories')}
          title="Click to manage categories"
        >
          <div className="metric-card-header">
            <span className="metric-label">Categories</span>
            <div className="metric-icon-box blue-icon">
              <FiFolder />
            </div>
          </div>
          <div className="metric-number">{stats?.totalCategories || 0}</div>
          <div className="metric-footer">
            <span>Manage Taxonomy →</span>
          </div>
        </div>

        {/* Total Enquiries */}
        <div
          className="metric-card"
          onClick={() => navigate('/enquiries')}
          title="Click to view all inquiries"
        >
          <div className="metric-card-header">
            <span className="metric-label">Total Inquiries</span>
            <div className="metric-icon-box blue-icon">
              <FiMessageSquare />
            </div>
          </div>
          <div className="metric-number">{stats?.totalEnquiries || 0}</div>
          <div className="metric-footer">
            <span>All Customer Requests →</span>
          </div>
        </div>

        {/* New Enquiries */}
        <div
          className="metric-card"
          onClick={() => navigate('/enquiries?status=New')}
          title="Click to view new inquiries"
        >
          <div className="metric-card-header">
            <span className="metric-label">New Inquiries</span>
            <div className="metric-icon-box cyan-icon">
              <FiMessageSquare />
            </div>
          </div>
          <div className="metric-number">{stats?.newEnquiries || 0}</div>
          <div className="metric-footer">
            <span>Pending Action →</span>
          </div>
        </div>

        {/* Converted Enquiries */}
        <div
          className="metric-card"
          onClick={() => navigate('/enquiries?status=Converted')}
          title="Click to view converted clients"
        >
          <div className="metric-card-header">
            <span className="metric-label">Converted Clients</span>
            <div className="metric-icon-box green-icon">
              <FiAward />
            </div>
          </div>
          <div className="metric-number">{stats?.convertedEnquiries || 0}</div>
          <div className="metric-footer">
            <span>Orders Finalized →</span>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Recent Inquiries & Recent Collections */}
      <div className="dashboard-tables-grid">
        {/* Recent Enquiries Table */}
        <div className="dash-table-card">
          <div className="table-card-header">
            <h3>Recent Customer Inquiries</h3>
            <Link to="/enquiries" className="see-all-link">
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {stats?.recentEnquiries && stats.recentEnquiries.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Artwork</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentEnquiries.map((enq) => (
                    <tr key={enq._id}>
                      <td>
                        <div className="customer-cell">
                          <strong>{enq.name}</strong>
                          <span>{enq.phone}</span>
                        </div>
                      </td>
                      <td>{enq.collectionName || 'General Inquiry'}</td>
                      <td>
                        <select
                          className={`status-select status-${enq.status.toLowerCase().replace(' ', '-')}`}
                          value={enq.status}
                          onChange={(e) => handleStatusChange(enq._id, e.target.value)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Converted">Converted</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td>
                        <div className="row-action-btns">
                          <a
                            href={generateWhatsAppLink(enq.phone, enq.name, enq.collectionName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="row-icon-btn wa-icon"
                            title="Chat on WhatsApp"
                          >
                            <FaWhatsapp />
                          </a>
                          <a
                            href={`tel:${enq.phone}`}
                            className="row-icon-btn call-icon"
                            title="Call Customer"
                          >
                            <FiPhone />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-empty-notice">No customer inquiries recorded yet.</div>
          )}
        </div>

        {/* Recent Collections Table */}
        <div className="dash-table-card">
          <div className="table-card-header">
            <h3>Recent Collections</h3>
            <Link to="/collections" className="see-all-link">
              <span>Manage All</span>
              <FiArrowRight />
            </Link>
          </div>

          {stats?.recentCollections && stats.recentCollections.length > 0 ? (
            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Artwork</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentCollections.map((col) => (
                    <tr key={col._id}>
                      <td>
                        <div className="artwork-cell">
                          <img
                            src={col.images?.[0]?.url || 'https://via.placeholder.com/40'}
                            alt={col.name}
                            className="artwork-thumb"
                          />
                          <Link to={`/collections/${col._id}/edit`} className="artwork-name-link">
                            {col.name}
                          </Link>
                        </div>
                      </td>
                      <td>{col.category?.name || 'Unassigned'}</td>
                      <td>
                        <span className={`admin-badge ${col.collectionType === 'premium' ? 'admin-badge-gold' : ''}`}>
                          {col.collectionType}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-badge ${col.isLive ? 'admin-badge-live' : 'admin-badge-hidden'}`}>
                          {col.isLive ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-empty-notice">
              No collections added yet.{' '}
              <Link to="/collections/create" style={{ color: 'var(--gold-light)' }}>
                Create your first collection →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
