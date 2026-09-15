import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '12px' }}>Admin Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>The requested administrative view does not exist.</p>
      <Link to="/dashboard" className="admin-btn admin-btn-primary">
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
