import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { Briefcase, ArrowRight, Lock, Mail } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, ...userData } = res.data;
      login(token, userData);

      switch (userData.role) {
        case 'ROLE_ADMIN':
          navigate('/admin');
          break;
        case 'ROLE_MANAGER':
          navigate('/manager');
          break;
        case 'ROLE_TL':
          navigate('/tl');
          break;
        default:
          navigate('/employee');
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or connection error');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (roleEmail, pass) => {
    setEmail(roleEmail);
    setPassword(pass);
  };

  return (
    <div className="login-section-01">
      <div className="login-section-02">
        <div className="login-section-03">
          <div className="login-section-04">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="login-heading-01">EPTMS Enterprise</h2>
            <p className="login-description-01">Sign in to your organization workspace</p>
          </div>
        </div>

        {error && (
          <div className="login-section-05">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form-01">
          <div>
            <label className="login-label-01">Work Email</label>
            <div className="login-section-06">
              <Mail className="login-mail-01" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eptms.io"
                className="login-input-01"
              />
            </div>
          </div>

          <div>
            <label className="login-label-01">Password</label>
            <div className="login-section-06">
              <Lock className="login-lock-01" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input-01"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button-01"
          >
            {loading ? 'Authenticating...' : 'Enter Workspace'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="login-section-07">
          <p className="login-description-02">Quick Login by Role</p>
          <div className="login-section-08">
            <button
              onClick={() => fillCredentials('admin@eptms.io', 'admin123')}
              className="login-button-02"
            >
              <span className="login-text-01">Admin</span>
              <span className="login-text-02">admin@eptms.io</span>
            </button>
            <button
              onClick={() => fillCredentials('manager@eptms.io', 'manager123')}
              className="login-button-03"
            >
              <span className="login-text-03">Manager</span>
              <span className="login-text-02">manager@eptms.io</span>
            </button>
            <button
              onClick={() => fillCredentials('tl@eptms.io', 'tl123')}
              className="login-button-04"
            >
              <span className="login-text-04">Team Lead</span>
              <span className="login-text-02">tl@eptms.io</span>
            </button>
            <button
              onClick={() => fillCredentials('employee@eptms.io', 'emp123')}
              className="login-button-05"
            >
              <span className="login-text-05">Employee</span>
              <span className="login-text-02">employee@eptms.io</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};