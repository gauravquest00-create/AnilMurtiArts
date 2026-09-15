import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', color: 'var(--gold-light)', marginBottom: '16px' }}>404</h1>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', marginBottom: '12px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '460px', margin: '0 auto 28px auto' }}>
        The page or collection you are looking for has been relocated or does not exist.
      </p>
      <Link to="/" className="btn btn-primary">
        <FiHome />
        <span>Return to Home Showroom</span>
      </Link>
    </div>
  );
};

export default NotFound;
