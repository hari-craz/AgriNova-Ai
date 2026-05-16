import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CROPS = ['Wheat', 'Rice', 'Corn', 'Tomato', 'Potato', 'Onion', 'Cotton', 'Soybean', 'Sugarcane', 'Mustard', 'Chili', 'Turmeric'];
const REGIONS = ['Punjab', 'Haryana', 'Maharashtra', 'Gujarat', 'Rajasthan', 'UP', 'Bihar', 'MP', 'Karnataka', 'Andhra Pradesh', 'Tamil Nadu', 'West Bengal'];

const StatBox = ({ label, value, sub, color = 'green', icon }) => (
  <div className={`glass rounded-2xl p-5 border ${color === 'green' ? 'border-primary-500/20' : color === 'blue' ? 'border-blue-500/20' : color === 'yellow' ? 'border-yellow-500/20' : 'border-red-500/20'}`}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <div className={`badge ${color === 'green' ? 'badge-green' : color === 'blue' ? 'badge-blue' : color === 'yellow' ? 'badge-yellow' : 'badge-red'}`}>Live</div>
    </div>
    <div className="font-display text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-gray-400 text-sm">{label}</div>
    {sub && <div className={`text-xs mt-1 ${color === 'green' ? 'text-primary-400' : 'text-gray-500'}`}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-xl border border-primary-500/20 text-sm">
      <p className="text-gray-300 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-sm">
          {p.name}: <span className="font-semibold">₹{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [crop, setCrop] = useState('Wheat');
  const [region, setRegion] = useState(user?.location || 'Punjab');
  const [quantity, setQuantity] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/api/analytics/stats').then(res => setStats(res.data.stats)).catch(() => {});
    // Auto-predict on load
    handlePredict();
  }, []);

  const handlePredict = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/predict/crop', { crop, region, quantity: quantity ? parseFloat(quantity) : undefined });
      setPrediction(res.data.prediction);
    } catch (error) {
      toast.error('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                AI Prediction Dashboard
              </h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.name?.split(' ')[0]} 👋 · Real-time market intelligence</p>
            </div>
            <div className="flex items-center gap-2 glass-green px-4 py-2 rounded-xl border border-primary-500/20">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              <span className="text-primary-300 text-sm font-medium">AI Model Active</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatBox icon="📦" label="Today's Orders" value={stats.todayOrders} sub="↑ 12% vs yesterday" color="green" />
            <StatBox icon="💰" label="Today's Revenue" value={`₹${(stats.todayRevenue / 1000).toFixed(0)}K`} sub="Platform-wide" color="blue" />
            <StatBox icon="👨‍🌾" label="Active Farmers" value={stats.activeFarmers} sub="Online now" color="yellow" />
            <StatBox icon="🔔" label="Pending Alerts" value={stats.pendingAlerts} sub="Needs attention" color="red" />
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Prediction Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-1">
            <div className="card h-full">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">🎯</div>
                <h2 className="font-display text-lg font-semibold text-white">Price Predictor</h2>
              </div>
              <form onSubmit={handlePredict} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Select Crop</label>
                  <select value={crop} onChange={(e) => setCrop(e.target.value)} className="input-field">
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Region</label>
                  <select value={region} onChange={(e) => setRegion(e.target.value)} className="input-field">
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quantity (quintal) <span className="text-gray-600">optional</span></label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g., 50"
                    className="input-field"
                    min="0"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</>
                  ) : '🤖 Predict Price →'}
                </button>
              </form>

              {/* Recommendations */}
              {prediction?.recommendations && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">AI Recommendations</h3>
                  {prediction.recommendations.map((rec, i) => (
                    <div key={i} className={`p-3 rounded-xl border text-sm ${
                      rec.priority === 'high' ? 'bg-primary-500/10 border-primary-500/30 text-primary-300' :
                      rec.priority === 'medium' ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' :
                      'bg-white/5 border-white/10 text-gray-400'
                    }`}>
                      <div className="font-semibold capitalize mb-1">{rec.type === 'sell' ? '📈 ' : rec.type === 'hold' ? '⏳ ' : '👁️ '}{rec.type}</div>
                      {rec.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Prediction Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Price Cards */}
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="glass rounded-2xl p-5 border border-white/10">
                      <div className="text-gray-500 text-xs mb-1">Current Price</div>
                      <div className="font-display text-2xl font-bold text-white">₹{prediction.currentPrice?.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs mt-1">/quintal</div>
                    </div>
                    <div className="glass-green rounded-2xl p-5 border border-primary-500/30 relative overflow-hidden">
                      <div className="scan-line" />
                      <div className="text-primary-400 text-xs mb-1">AI Predicted Price</div>
                      <div className="font-display text-2xl font-bold text-primary-300">₹{prediction.predictedPrice?.toLocaleString()}</div>
                      <div className={`text-xs mt-1 font-semibold ${prediction.priceChange >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
                        {prediction.priceChange >= 0 ? '↑' : '↓'} {Math.abs(prediction.priceChange)}%
                      </div>
                    </div>
                    <div className="glass rounded-2xl p-5 border border-white/10">
                      <div className="text-gray-500 text-xs mb-1">AI Confidence</div>
                      <div className="font-display text-2xl font-bold text-white">{prediction.confidence}%</div>
                      <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-600 to-emerald-400 rounded-full" style={{ width: `${prediction.confidence}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Demand/Supply */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="glass rounded-2xl p-5 border border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400 text-sm">Market Demand</span>
                        <span className="text-primary-300 font-semibold">{prediction.demandScore}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${prediction.demandScore}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-primary-600 to-emerald-400 rounded-full" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2 capitalize">Demand: {prediction.demand}</div>
                    </div>
                    <div className="glass rounded-2xl p-5 border border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-400 text-sm">Market Supply</span>
                        <span className="text-blue-300 font-semibold">{prediction.supplyScore}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${prediction.supplyScore}%` }} transition={{ delay: 0.6, duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Season: {prediction.season}</div>
                    </div>
                  </div>

                  {/* Price Trend Chart */}
                  {prediction.trend && (
                    <div className="glass rounded-2xl p-5 border border-white/10">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        📈 <span>6-Month Price Trend — {prediction.crop} ({prediction.region})</span>
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={prediction.trend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(1)}K`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} name="Price" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Market Insight */}
                  <div className="glass-green rounded-2xl p-4 border border-primary-500/20 mt-4">
                    <div className="flex gap-2">
                      <span className="text-xl">💡</span>
                      <div>
                        <div className="text-primary-300 font-semibold text-sm mb-1">AI Market Insight</div>
                        <p className="text-gray-400 text-sm">{prediction.marketInsight}</p>
                        {prediction.bestMarkets && (
                          <div className="flex gap-2 mt-2">
                            <span className="text-gray-500 text-xs">Best markets:</span>
                            {prediction.bestMarkets.map((m, i) => <span key={i} className="badge-green">{m}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-5xl mb-4">🌾</div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">AI Ready</h3>
                  <p className="text-gray-400">Select your crop and region, then click "Predict Price" to get AI-powered market insights.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
