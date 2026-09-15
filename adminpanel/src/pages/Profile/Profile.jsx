import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiCheckCircle, FiSave } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { adminUpdateProfile, adminChangePassword } from '../../api/adminApi';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });

    try {
      setProfileLoading(true);
      const res = await adminUpdateProfile(profileData);
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Profile details updated successfully.' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    try {
      setPasswordLoading(true);
      await adminChangePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="admin-profile-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Executive Profile & Security</h1>
          <p className="page-desc">Manage administrative contact credentials, role settings, and security passwords.</p>
        </div>
      </div>

      <div className="profile-grid-layout">
        {/* Profile Settings Card */}
        <div className="profile-card">
          <div className="card-header-icon-flex">
            <FiUser className="card-header-icon" />
            <h3 className="card-title">Profile Information</h3>
          </div>

          {profileMsg.text && (
            <div className={`status-msg-banner ${profileMsg.type}`}>{profileMsg.text}</div>
          )}

          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="admin-form-field">
              <label>Administrator Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Official Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Phone / WhatsApp Contact</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              />
            </div>

            <div className="admin-form-field">
              <label>Assigned Administrative Role</label>
              <input type="text" value={user?.role || 'admin'} disabled style={{ opacity: 0.6 }} />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" disabled={profileLoading}>
              <FiSave />
              <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="profile-card">
          <div className="card-header-icon-flex">
            <FiLock className="card-header-icon" />
            <h3 className="card-title">Change Password</h3>
          </div>

          {passwordMsg.text && (
            <div className={`status-msg-banner ${passwordMsg.type}`}>{passwordMsg.text}</div>
          )}

          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <div className="admin-form-field">
              <label>Current Security Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>New Security Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="admin-form-field">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary" disabled={passwordLoading}>
              <FiLock />
              <span>{passwordLoading ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
