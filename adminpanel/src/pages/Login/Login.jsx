import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/brand/anil-murti-art-logo.svg';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('admin@anilmurtiart.com');
  const [password, setPassword] = useState('Admin@12345');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="login-card-box">
        <div className="login-header">
          <img src={logoImg} alt="Anil Murti Art" className="login-brand-logo" />
          <h1 className="login-title">Executive Control Portal</h1>
          <p className="login-subtitle">Anil Murti Art — Master Marble Sculptures Management</p>
        </div>

        {error && <div className="login-error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email">Administrator Email</label>
            <div className="login-input-field">
              <FiMail className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@anilmurtiart.com"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Security Password</label>
            <div className="login-input-field">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="toggle-pass-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="admin-btn admin-btn-primary login-submit-btn" disabled={submitting}>
            <span>{submitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            <FiArrowRight />
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default Login;
