import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import api from '../api/axios';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const MetricCard = ({ icon, label, value, sub, trend, color = 'green' }) => {
  const colors = {
    green: 'border-primary-500/20 text-primary-300',
    blue: 'border-blue-500/20 text-blue-300',
    yellow: 'border-yellow-500/20 text-yellow-300',
    purple: 'border-purple-500/20 text-purple-300'
  };
  return (
    <div className={`glass rounded-2xl p-5 border ${colors[color]}`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-primary-500/20 text-primary-400' : 'bg-red-500/20 text-red-400'}`}>{trend}</span>}
      </div>
      <div className="font-display text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
      {sub && <div className="text-gray-600 text-xs mt-1">{sub}</div>}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-xl border border-primary-500/20 text-xs">
      <p className="text-gray-300 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? `₹${p.value.toLocaleString()}` : p.value}</strong></p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState('income');

  useEffect(() => {
    api.get('/api/analytics').then(res => setData(res.data.analytics)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading analytics...</p>
      </div>
    </div>
  );

  const { summary, monthlyData, cropDemand, wasteByCategory, regionalData, weeklyTrends, impactMetrics } = data || {};

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-white">Analytics & Impact</h1>
          <p className="text-gray-400 mt-1">Real-time sustainability metrics · Food waste reduction · Farmer income growth</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <MetricCard icon="🌾" label="Active Farmers" value={summary?.totalFarmers?.toLocaleString()} trend="+12%" color="green" />
          <MetricCard icon="🛒" label="Buyers" value={summary?.totalBuyers?.toLocaleString()} trend="+18%" color="blue" />
          <MetricCard icon="♻️" label="Waste Reduced" value={summary?.foodWasteReduced} trend="+8.2%" color="green" />
          <MetricCard icon="💰" label="Income Growth" value={summary?.farmerIncomeIncrease} trend="+5.3%" color="yellow" />
          <MetricCard icon="🌍" label="CO₂ Saved" value={summary?.co2Saved} trend="+22%" color="purple" />
          <MetricCard icon="🏆" label="Sustainability" value={`${summary?.sustainabilityScore}/100`} color="green" />
        </motion.div>

        {/* Main Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Trends */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-white">Monthly Performance Trends</h3>
              <div className="flex gap-1.5">
                {['income', 'waste', 'co2'].map(m => (
                  <button key={m} onClick={() => setActiveMetric(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-all ${activeMetric === m ? 'bg-primary-500/30 text-primary-300 border border-primary-500/30' : 'text-gray-500 hover:text-gray-300'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                {activeMetric === 'income' && <Area type="monotone" dataKey="farmerIncome" stroke="#22c55e" fill="url(#areaGrad)" strokeWidth={2} name="Farmer Income (₹)" />}
                {activeMetric === 'waste' && <Area type="monotone" dataKey="foodWaste" stroke="#f59e0b" fill="url(#areaGrad)" strokeWidth={2} name="Food Waste (tons)" />}
                {activeMetric === 'co2' && <Area type="monotone" dataKey="co2Saved" stroke="#3b82f6" fill="url(#areaGrad)" strokeWidth={2} name="CO₂ Saved (kg)" />}
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Crop Demand */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
            <h3 className="font-display font-semibold text-white mb-4">Crop Demand vs Supply Index</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cropDemand} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" tick={{ fill: '#6b7280', fontSize: 10 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                <Bar dataKey="demand" fill="#22c55e" radius={[3, 3, 0, 0]} name="Demand" opacity={0.9} />
                <Bar dataKey="supply" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Supply" opacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Second Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Waste by Category Pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
            <h3 className="font-display font-semibold text-white mb-4">Waste Saved by Category</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={wasteByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="savedTons" nameKey="category" paddingAngle={3}>
                  {wasteByCategory?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}t`, 'Saved']} contentStyle={{ background: '#051a0e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {wasteByCategory?.map((w, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-400">{w.category}</span>
                  </div>
                  <span className="text-white font-medium">{w.savedTons}t <span className="text-gray-600">({w.percentage}%)</span></span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card col-span-1 lg:col-span-2">
            <h3 className="font-display font-semibold text-white mb-4">This Week's Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
                <Bar yAxisId="left" dataKey="orders" fill="#22c55e" radius={[3, 3, 0, 0]} name="Orders" />
                <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={false} name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Regional Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card mb-6">
          <h3 className="font-display font-semibold text-white mb-4">Regional Performance Dashboard</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Region', 'Farmers', 'Waste Reduced', 'Income Growth', 'Transactions', 'Score'].map(h => (
                    <th key={h} className="text-left py-2.5 px-3 text-gray-500 font-medium text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regionalData?.map((r, i) => (
                  <tr key={i} className="table-row">
                    <td className="py-3 px-3 font-medium text-white">{r.region}</td>
                    <td className="py-3 px-3 text-gray-300">{r.farmers}</td>
                    <td className="py-3 px-3"><span className="text-primary-300 font-semibold">{r.wasteReduced}%</span></td>
                    <td className="py-3 px-3"><span className="text-blue-300 font-semibold">+{r.incomeIncrease}%</span></td>
                    <td className="py-3 px-3 text-gray-300">{r.transactions.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[60px]">
                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.round(50 + r.incomeIncrease * 1.5)}%` }} />
                        </div>
                        <span className="text-gray-400 text-xs">{Math.round(50 + r.incomeIncrease * 1.5)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Impact Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="glass-green rounded-2xl p-6 border border-primary-500/20">
          <h3 className="font-display text-xl font-bold text-white mb-6 text-center">🌍 Real-World Impact Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: '👨‍👩‍👧‍👦', label: 'Families Benefited', value: impactMetrics?.familiesBenefited?.toLocaleString() },
              { icon: '💧', label: 'Water Saved', value: impactMetrics?.waterSaved },
              { icon: '🧪', label: 'Chemical Reduction', value: impactMetrics?.chemicalReduction },
              { icon: '📉', label: 'Before AgriNova', value: `₹${(impactMetrics?.avgFarmerIncomeBefore / 1000).toFixed(0)}K/yr` },
              { icon: '📈', label: 'After AgriNova', value: `₹${(impactMetrics?.avgFarmerIncomeAfter / 1000).toFixed(0)}K/yr` },
              { icon: '⬆️', label: 'Income Delta', value: `+₹${((impactMetrics?.avgFarmerIncomeAfter - impactMetrics?.avgFarmerIncomeBefore) / 1000).toFixed(0)}K/yr` },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="font-display font-bold text-white text-lg">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
