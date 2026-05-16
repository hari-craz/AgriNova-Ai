import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const CROPS = ['Wheat', 'Rice', 'Corn', 'Tomato', 'Potato', 'Onion', 'Cotton', 'Soybean', 'Sugarcane', 'Mustard', 'Chili', 'Turmeric'];
const STATES = ['Punjab', 'Haryana', 'Maharashtra', 'Gujarat', 'Rajasthan', 'UP', 'Bihar', 'MP', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'West Bengal', 'Telangana', 'Jharkhand', 'Chhattisgarh'];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'farmer', location: '', farmSize: '', crops: []
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleCrop = (crop) => {
    setForm(prev => ({
      ...prev,
      crops: prev.crops.includes(crop) ? prev.crops.filter(c => c !== crop) : [...prev.crops, crop]
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (form.password !== form.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { confirmPassword, ...submitData } = form;
    const res = await register(submitData);
    setLoading(false);
    if (res.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary-500/8 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-lg shadow-lg shadow-primary-500/30">🌱</div>
            <span className="font-display text-xl font-bold gradient-text">AgriNova AI</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Join 12,000+ farmers transforming agriculture</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className={`flex items-center gap-2 ${s < step ? 'text-primary-400' : s === step ? 'text-white' : 'text-gray-600'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                s < step ? 'bg-primary-600 border-primary-600' :
                s === step ? 'border-primary-500 bg-primary-500/20' :
                'border-white/20 bg-white/5'
              }`}>
                {s < step ? '✓' : s}
              </div>
              <span className="text-xs hidden sm:block">{s === 1 ? 'Account' : 'Farm Details'}</span>
              {s < 2 && <div className="w-8 h-px bg-white/10 ml-1" />}
            </div>
          ))}
        </div>

        <div className="card p-8">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Rajan Patel"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="rajan@example.com"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">I am a</label>
                <div className="grid grid-cols-2 gap-2">
                  {['farmer', 'buyer'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => updateForm('role', role)}
                      className={`py-2.5 rounded-xl border text-sm font-medium capitalize transition-all ${
                        form.role === role
                          ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                          : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                      }`}
                    >
                      {role === 'farmer' ? '👨‍🌾 ' : '🛒 '}{role}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => updateForm('password', e.target.value)}
                    placeholder="Min. 6 characters"
                    required minLength={6}
                    className="input-field pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm">
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => updateForm('confirmPassword', e.target.value)}
                  placeholder="Repeat password"
                  required
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3.5">
                Continue →
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">State / Region</label>
                <select
                  value={form.location}
                  onChange={(e) => updateForm('location', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select your state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {form.role === 'farmer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Farm Size (acres)</label>
                    <input
                      type="number"
                      value={form.farmSize}
                      onChange={(e) => updateForm('farmSize', e.target.value)}
                      placeholder="e.g., 5"
                      min="0"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Your Crops <span className="text-gray-600">(select all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {CROPS.map(crop => (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => toggleCrop(crop)}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                            form.crops.includes(crop)
                              ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {crop}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating...</>
                  ) : 'Create Account 🚀'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
