import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNo: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const payload = isLogin 
        ? { username: formData.username, password: formData.password }
        : formData;

      console.log('Attempting to connect to:', `${API_BASE_URL}${endpoint}`);
      console.log('Payload:', payload);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        if (isLogin) {
          setMessage('Login successful! Redirecting...');
          setTimeout(() => {
            onAuthSuccess(data.user);
          }, 1000);
        } else {
          setMessage('Signup successful! Please login.');
          setIsLogin(true);
          setFormData({
            username: '',
            password: '',
            email: '',
            phoneNo: ''
          });
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.message.includes('fetch')) {
        setMessage('Cannot connect to server. Please ensure the backend is running on localhost:5000');
      } else {
        setMessage(error.message || 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({
      username: '',
      password: '',
      email: '',
      phoneNo: ''
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-glass">
        <div className="auth-header">
          <h1 className="netflix-logo">NETFLIX</h1>
          <h2 className="auth-title">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h2>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Enter your email and password to access your account' 
              : 'Create your account to start watching'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="auth-input"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="auth-input"
                required
              />
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className="auth-input"
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="auth-input"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        {message && (
          <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="auth-toggle">
          <p>
            {isLogin ? "New to Netflix?" : "Already have an account?"}
            <button 
              type="button" 
              onClick={toggleMode}
              className="toggle-button"
            >
              {isLogin ? 'Sign up now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
