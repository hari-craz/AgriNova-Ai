import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (res.success) navigate('/dashboard');
  };

  const handleDemo = async (role) => {
    setLoading(true);
    const credentials = {
      farmer: { email: 'demo.farmer@agrinova.ai', password: 'demo123456' },
      buyer: { email: 'demo.buyer@agrinova.ai', password: 'demo123456' },
    };
    const cred = credentials[role];
    setForm(cred);
    const res = await login(cred.email, cred.password);
    setLoading(false);
    if (res.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-emerald-500/6 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-lg shadow-lg shadow-primary-500/30">🌱</div>
            <span className="font-display text-xl font-bold gradient-text">AgriNova AI</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your agricultural dashboard</p>
        </div>

        <div className="card p-8">
          {/* Demo Login */}
          <div className="mb-6">
            <p className="text-gray-500 text-xs text-center mb-3">Quick demo access</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemo('farmer')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 glass border border-primary-500/20 hover:border-primary-500/40 text-primary-300 text-sm rounded-xl transition-all hover:bg-primary-500/10"
              >
                👨‍🌾 Demo Farmer
              </button>
              <button
                onClick={() => handleDemo('buyer')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 glass border border-blue-500/20 hover:border-blue-500/40 text-blue-300 text-sm rounded-xl transition-all hover:bg-blue-500/10"
              >
                🛒 Demo Buyer
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-xs">or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="farmer@example.com"
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In to Dashboard →'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            New to AgriNova AI?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
