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
    <div className="min-h-screen bg-slate-100/70 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 shadow-xl shadow-slate-200/50">
        <div className="flex items-center gap-3.5 mb-6">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-500/30">
            <Briefcase size={24} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">EPTMS Enterprise</h2>
            <p className="text-xs font-medium text-slate-500">Sign in to your organization workspace</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@eptms.io"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Workspace'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-bold mb-3">Quick Login by Role</p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => fillCredentials('admin@eptms.io', 'admin123')}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-blue-50 hover:border-blue-200 text-left transition-all cursor-pointer"
            >
              <span className="text-blue-600 font-bold block text-xs">Admin</span>
              <span className="text-[11px] text-slate-500 truncate block">admin@eptms.io</span>
            </button>
            <button
              onClick={() => fillCredentials('manager@eptms.io', 'manager123')}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 text-left transition-all cursor-pointer"
            >
              <span className="text-emerald-600 font-bold block text-xs">Manager</span>
              <span className="text-[11px] text-slate-500 truncate block">manager@eptms.io</span>
            </button>
            <button
              onClick={() => fillCredentials('tl@eptms.io', 'tl123')}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-amber-50 hover:border-amber-200 text-left transition-all cursor-pointer"
            >
              <span className="text-amber-600 font-bold block text-xs">Team Lead</span>
              <span className="text-[11px] text-slate-500 truncate block">tl@eptms.io</span>
            </button>
            <button
              onClick={() => fillCredentials('employee@eptms.io', 'emp123')}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 text-left transition-all cursor-pointer"
            >
              <span className="text-indigo-600 font-bold block text-xs">Employee</span>
              <span className="text-[11px] text-slate-500 truncate block">employee@eptms.io</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};