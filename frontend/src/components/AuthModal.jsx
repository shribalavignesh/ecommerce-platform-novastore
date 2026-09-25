import React, { useState } from 'react';
import { X, Shield, User, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './NotificationToast';

export default function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, loginAsDemo } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(name, email, password, role);
        showToast(`Welcome ${name}! Your account is ready.`);
      } else {
        await login(email, password);
        showToast('Logged in successfully!');
      }
      onClose();
    } catch (err) {
      showToast(err.message || 'Authentication error', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemoClick(demoRole) {
    setSubmitting(true);
    try {
      await loginAsDemo(demoRole);
      showToast(`Logged in as Demo ${demoRole === 'admin' ? 'Store Administrator' : 'Customer'}!`);
      onClose();
    } catch (err) {
      showToast(err.message || 'Demo login failed', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden relative">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              N
            </div>
            <span className="font-semibold text-lg tracking-tight">NovaStore Portal</span>
          </div>
          <p className="text-slate-300 text-xs mt-1">
            {isRegister
              ? 'Join today to enjoy expedited delivery and order tracking.'
              : 'Sign in to access your orders, saved addresses, or admin panel.'}
          </p>

          {/* Tab buttons */}
          <div className="flex mt-5 bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                !isRegister ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                isRegister ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Quick Demo Login Presets */}
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant 1-Click Evaluation Presets:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                disabled={submitting}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg transition text-left"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('user')}
                disabled={submitting}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition text-left"
              >
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Customer Demo</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                >
                  <option value="user">Customer (Browse, Cart & Orders)</option>
                  <option value="admin">Administrator (Catalog & Order Management)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{submitting ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
