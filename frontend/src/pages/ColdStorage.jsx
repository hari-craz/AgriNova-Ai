import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios';
import toast from 'react-hot-toast';

const GaugeBar = ({ value, max, label, unit, color = 'primary', warn, danger }) => {
  const pct = Math.min((value / max) * 100, 100);
  const isWarn = warn && value > warn;
  const isDanger = danger && value > danger;
  const barColor = isDanger ? '#ef4444' : isWarn ? '#eab308' : color === 'primary' ? '#22c55e' : '#3b82f6';
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-400">{label}</span>
        <span className="font-mono font-semibold" style={{ color: barColor }}>{value}{unit}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
          className="h-full rounded-full" style={{ background: barColor }} />
      </div>
    </div>
  );
};

const ChamberCard = ({ chamber, index }) => {
  const statusColors = { optimal: 'badge-green', warning: 'badge-yellow', critical: 'badge-red' };
  const statusIcons = { optimal: '✅', warning: '⚠️', critical: '🚨' };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className={`card border ${chamber.status === 'optimal' ? 'border-primary-500/20' : chamber.status === 'warning' ? 'border-yellow-500/30' : 'border-red-500/30'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-white">{chamber.name}</h3>
          <p className="text-gray-500 text-sm">{chamber.crop}</p>
        </div>
        <span className={statusColors[chamber.status] || 'badge-green'}>
          {statusIcons[chamber.status]} {chamber.status}
        </span>
      </div>
      <div className="space-y-3 mb-4">
        <GaugeBar value={chamber.temperature} max={20} label="Temperature" unit="°C" warn={10} danger={15} />
        <GaugeBar value={chamber.humidity} max={100} label="Humidity" unit="%" warn={95} color="blue" />
        <GaugeBar value={chamber.used} max={chamber.capacity} label="Capacity Used" unit=" t" warn={chamber.capacity * 0.85} color="primary" />
      </div>
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
        <div className="text-center">
          <div className="font-mono text-sm font-bold text-yellow-400">{chamber.solarPower} kW</div>
          <div className="text-gray-600 text-xs">Solar</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-sm font-bold text-primary-400">{chamber.used}t</div>
          <div className="text-gray-600 text-xs">Stored</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-sm font-bold text-blue-400">{chamber.capacity - chamber.used}t</div>
          <div className="text-gray-600 text-xs">Available</div>
        </div>
      </div>
      {chamber.alerts.length > 0 && (
        <div className="mt-3 p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
          {chamber.alerts.map((a, i) => (
            <p key={i} className="text-yellow-400 text-xs">⚠️ {a.message}</p>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default function ColdStorage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('temperature');

  const fetchData = async () => {
    try {
      const res = await api.get('/api/predict/cold-storage');
      setData(res.data.coldStorage);
    } catch {
      toast.error('Failed to load cold storage data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading sensor data...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Smart Cold Storage</h1>
              <p className="text-gray-400 mt-1">Real-time IoT monitoring · Solar-powered · AI alerts</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 glass-green px-3 py-2 rounded-xl border border-primary-500/20">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                <span className="text-primary-300 text-sm">Live Sensors</span>
              </div>
              <button onClick={fetchData} className="btn-ghost text-sm px-4 py-2">
                🔄 Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        {data?.summary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
            {[
              { label: 'Total Capacity', value: `${data.summary.totalCapacity}t`, icon: '🏭', color: 'primary' },
              { label: 'Currently Stored', value: `${data.summary.totalUsed}t`, icon: '📦', color: 'blue' },
              { label: 'Solar Power', value: `${data.summary.totalSolarKW} kW`, icon: '☀️', color: 'yellow' },
              { label: 'Spoilage Reduced', value: `${data.summary.spoilageReduced}%`, icon: '♻️', color: 'green' },
              { label: 'Energy Saved', value: `${data.summary.energySaved} kWh`, icon: '⚡', color: 'blue' },
              { label: 'CO₂ Saved', value: `${data.summary.co2Saved}kg`, icon: '🌍', color: 'green' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-4 border border-white/10 text-center">
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="font-display font-bold text-white text-lg">{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Chamber Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {data?.chambers?.map((chamber, i) => (
            <ChamberCard key={chamber.id} chamber={chamber} index={i} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Temperature History */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-white">24-Hour Temperature Log</h3>
              <div className="flex gap-2">
                {['CH-01', 'CH-02', 'CH-03'].map((c, i) => (
                  <div key={c} className="flex items-center gap-1 text-xs text-gray-400">
                    <div className="w-2 h-2 rounded-full" style={{ background: ['#22c55e', '#3b82f6', '#f59e0b'][i] }} />
                    {c}
                  </div>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.temperatureHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 11 }} interval={3} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}°C`} />
                <Tooltip contentStyle={{ background: '#051a0e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px' }} labelStyle={{ color: '#d1d5db' }} />
                <Line type="monotone" dataKey="ch1" stroke="#22c55e" strokeWidth={2} dot={false} name="Alpha" />
                <Line type="monotone" dataKey="ch2" stroke="#3b82f6" strokeWidth={2} dot={false} name="Beta" />
                <Line type="monotone" dataKey="ch3" stroke="#f59e0b" strokeWidth={2} dot={false} name="Gamma" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Solar Power */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="card">
            <h3 className="font-display font-semibold text-white mb-6">Solar Power Output (Today)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data?.solarHistory}>
                <defs>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={v => `${v}kW`} />
                <Tooltip contentStyle={{ background: '#051a0e', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px' }} labelStyle={{ color: '#d1d5db' }} />
                <Area type="monotone" dataKey="output" stroke="#f59e0b" strokeWidth={2.5} fill="url(#solarGrad)" name="Solar kW" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
              <div className="text-center">
                <div className="text-yellow-400 font-bold">{data?.summary?.totalSolarKW} kW</div>
                <div className="text-gray-500 text-xs">Current Output</div>
              </div>
              <div className="text-center">
                <div className="text-primary-400 font-bold">{data?.summary?.energySaved} kWh</div>
                <div className="text-gray-500 text-xs">Saved Today</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold">{data?.summary?.co2Saved}kg</div>
                <div className="text-gray-500 text-xs">CO₂ Offset</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Storage Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-6 glass-green rounded-2xl p-6 border border-primary-500/20">
          <h3 className="font-display font-semibold text-white mb-4">💡 AI Storage Recommendations</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: '🥔', crop: 'Potatoes', tip: 'Optimal conditions. Maintain 2-4°C. Expected storage: 6 months.' },
              { icon: '🧅', crop: 'Onions', tip: 'Humidity slightly high. Consider ventilation to prevent sprouting.' },
              { icon: '🍅', crop: 'Tomatoes', tip: 'Monitor for ethylene buildup. Separate from ethylene-sensitive produce.' },
              { icon: '☀️', crop: 'Solar Status', tip: `Running at ${Math.round(75 + Math.random() * 20)}% efficiency. Peak hours 10AM-2PM.` },
            ].map((item, i) => (
              <div key={i} className="glass p-4 rounded-xl border border-white/5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-white font-medium text-sm mb-1">{item.crop}</div>
                <div className="text-gray-400 text-xs leading-relaxed">{item.tip}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
