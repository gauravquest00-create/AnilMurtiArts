import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiBox,
  FiFolder,
  FiMessageSquare,
  FiUser,
  FiLogOut,
  FiExternalLink,
  FiChevronsLeft,
  FiChevronsRight
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/brand/anil-murti-art-logo.svg';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('admin_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('admin_sidebar_collapsed', String(newState));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`admin-app-layout ${isCollapsed ? 'layout-collapsed' : ''}`}>
      {/* MOBILE TOPBAR */}
      <header className="admin-mobile-topbar">
        <div className="admin-mobile-brand">
          <img src={logoImg} alt="Anil Murti Art" className="admin-mobile-logo" />
          <span className="admin-mobile-title">ADMIN PORTAL</span>
        </div>

        <div className="admin-mobile-top-actions">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-top-action-btn"
            title="Open Public Showroom"
          >
            <FiExternalLink />
          </a>
          <button
            onClick={handleLogout}
            className="admin-top-action-btn logout-btn"
            title="Sign Out"
          >
            <FiLogOut />
          </button>
        </div>
      </header>

      {/* DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside className={`admin-desktop-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          {!isCollapsed ? (
            <>
              <div className="sidebar-brand-left">
                <img src={logoImg} alt="Anil Murti Art Logo" className="sidebar-brand-logo" />
                <div className="sidebar-brand-meta">
                  <span className="sidebar-brand-name">ANIL MURTI ART</span>
                  <span className="sidebar-badge">EXECUTIVE CONTROL</span>
                </div>
              </div>
              <button
                className="sidebar-collapse-toggle-btn"
                onClick={toggleSidebar}
                title="Collapse Sidebar"
                aria-label="Collapse Sidebar"
              >
                <FiChevronsLeft />
              </button>
            </>
          ) : (
            /* When collapsed: Logo is hidden and replaced by >> button */
            <div className="collapsed-expand-wrapper">
              <button
                className="sidebar-expand-toggle-btn"
                onClick={toggleSidebar}
                title="Expand Sidebar"
                aria-label="Expand Sidebar"
              >
                <FiChevronsRight />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Dashboard"
          >
            <FiGrid className="nav-icon" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/collections"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Collections"
          >
            <FiBox className="nav-icon" />
            {!isCollapsed && <span>Collections</span>}
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Categories"
          >
            <FiFolder className="nav-icon" />
            {!isCollapsed && <span>Categories</span>}
          </NavLink>

          <NavLink
            to="/enquiries"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Inquiries"
          >
            <FiMessageSquare className="nav-icon" />
            {!isCollapsed && <span>Inquiries</span>}
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            title="Admin Profile"
          >
            <FiUser className="nav-icon" />
            {!isCollapsed && <span>Admin Profile</span>}
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link live-showroom-btn"
            title="View Public Website"
          >
            <FiExternalLink className="nav-icon" />
            {!isCollapsed && <span>View Showroom</span>}
          </a>

          {!isCollapsed ? (
            <div className="sidebar-user-card">
              <div className="user-avatar-circle">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Administrator'}</span>
                <span className="user-role">{user?.email || 'admin@anilmurtiart.com'}</span>
              </div>
              <button onClick={handleLogout} className="logout-action-btn" title="Sign Out">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="collapsed-logout-btn" title="Sign Out">
              <FiLogOut />
            </button>
          )}
        </div>
      </aside>

      {/* MAIN WORKSPACE WRAPPER */}
      <div className="admin-main-wrapper">
        <header className="admin-desktop-header">
          <div className="header-greeting">
            <span>Welcome, <strong>{user?.name || 'Administrator'}</strong></span>
          </div>
          <div className="header-actions-right">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn-secondary"
            >
              <FiExternalLink />
              <span>Open Public Showroom</span>
            </a>
          </div>
        </header>

        <main className="admin-page-content">{children}</main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="admin-mobile-bottom-nav" aria-label="Admin Mobile Navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <FiGrid className="bottom-nav-icon" />
          <span className="bottom-nav-label">Dashboard</span>
        </NavLink>

        <NavLink
          to="/collections"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <FiBox className="bottom-nav-icon" />
          <span className="bottom-nav-label">Collections</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <FiFolder className="bottom-nav-icon" />
          <span className="bottom-nav-label">Categories</span>
        </NavLink>

        <NavLink
          to="/enquiries"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <FiMessageSquare className="bottom-nav-icon" />
          <span className="bottom-nav-label">Inquiries</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
        >
          <FiUser className="bottom-nav-icon" />
          <span className="bottom-nav-label">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminLayout;
