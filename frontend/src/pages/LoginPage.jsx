import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { FileText, Lock, Mail, ArrowRight, Eye, EyeOff, Shield, Users, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const user = await login(email.trim(), password);
      showSuccess(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid email or password.';
      setServerError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFieldErrors({});
    setServerError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 lg:p-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Panel: Value Proposition & Branding */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-slate-900/60 border-r border-slate-800/80 relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-600/10 text-blue-500 rounded-2xl border border-blue-500/20 shadow-inner">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider text-white">AJAIA DOCS</h1>
                <p className="text-xs text-blue-400 font-medium">Team Workspace</p>
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Work together, write better.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Create, edit and share documents with your team without friction. Built with lightweight real-time persistence and strict backend access control.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Rich Text Editing with TipTap & ProseMirror</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Team Sharing & Permission Control</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Import Plain Text (.txt) & Markdown (.md)</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-8 border-t border-slate-800/60">
            Ajaia Docs MVP — Production-Style Full-Stack Architecture
          </div>
        </div>

        {/* Right Panel: Login Form & Demo Chips */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-6 bg-slate-950/40">
          {/* Mobile Header Branding */}
          <div className="lg:hidden flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600/10 text-blue-500 rounded-xl border border-blue-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AJAIA DOCS</h1>
              <p className="text-xs text-slate-400">Work together, write better.</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Sign in to your account</h3>
            <p className="text-xs text-slate-400 mt-1">Enter your credentials to access your workspace</p>
          </div>

          {serverError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl flex items-center gap-2">
              <span className="font-semibold">Error:</span> {serverError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: null }));
                  }}
                  placeholder="alex@ajaia.demo"
                  className={`w-full bg-slate-900 border text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none transition-colors ${
                    fieldErrors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-rose-400 font-medium pl-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-slate-900 border text-slate-200 text-sm rounded-xl pl-10 pr-10 py-2.5 focus:outline-none transition-colors ${
                    fieldErrors.password ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-blue-500'
                  }`}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-rose-400 font-medium pl-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Clickable Demo Accounts Section */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Demo Accounts (Click to populate):</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('alex@ajaia.demo', 'demo123')}
                className="py-2 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all text-center truncate"
              >
                Alex
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('sarah@ajaia.demo', 'demo123')}
                className="py-2 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all text-center truncate"
              >
                Sarah
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('john@ajaia.demo', 'demo123')}
                className="py-2 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-medium transition-all text-center truncate"
              >
                John
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center">
              Password for all demo accounts: <code className="text-slate-400 bg-slate-900 px-1 py-0.5 rounded">demo123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
