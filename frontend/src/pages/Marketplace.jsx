import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['all', 'vegetables', 'fruits', 'grains', 'pulses', 'spices', 'dairy', 'other'];
const UNITS = ['kg', 'quintal', 'ton', 'piece', 'dozen', 'liter'];
const CATEGORY_ICONS = { vegetables: '🥦', fruits: '🍎', grains: '🌾', pulses: '🫘', spices: '🌶️', dairy: '🥛', other: '📦', all: '🛒' };

const emptyForm = { name: '', category: 'vegetables', description: '', price: '', unit: 'kg', quantity: '', location: '', isOrganic: false };

const ProductCard = ({ product, onOrder, onDelete, isOwner }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
    className="card group hover:glow-green">
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{CATEGORY_ICONS[product.category] || '📦'}</span>
          <h3 className="font-semibold text-white">{product.name}</h3>
        </div>
        <p className="text-gray-500 text-xs">by {product.farmerName} · {product.location}</p>
      </div>
      {product.isOrganic && <span className="badge-green text-xs">🌱 Organic</span>}
    </div>
    {product.description && (
      <p className="text-gray-400 text-sm mb-3 leading-relaxed line-clamp-2">{product.description}</p>
    )}
    <div className="grid grid-cols-2 gap-2 mb-4">
      <div className="glass rounded-lg p-2.5">
        <div className="text-primary-300 font-bold text-lg">₹{product.price?.toLocaleString()}</div>
        <div className="text-gray-500 text-xs">per {product.unit}</div>
      </div>
      <div className="glass rounded-lg p-2.5">
        <div className="text-white font-bold text-lg">{product.quantity}</div>
        <div className="text-gray-500 text-xs">{product.unit} available</div>
      </div>
    </div>
    <div className="flex gap-2">
      {isOwner ? (
        <button onClick={() => onDelete(product._id)} className="flex-1 py-2 text-sm text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/10 transition-all">
          🗑️ Remove
        </button>
      ) : (
        <button
          onClick={() => onOrder(product)}
          disabled={product.status !== 'available'}
          className="flex-1 btn-primary py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.status === 'available' ? '🛒 Place Order' : '✋ Sold Out'}
        </button>
      )}
      <button className="px-3 py-2 glass border border-white/10 rounded-xl text-gray-400 hover:text-white text-sm transition-colors">
        👁️ {product.views || 0}
      </button>
    </div>
  </motion.div>
);

const OrderModal = ({ product, onClose, onConfirm }) => {
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const total = product.price * qty;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-2xl p-6 w-full max-w-sm border border-primary-500/20" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-xl font-bold text-white mb-4">Place Order</h3>
        <div className="glass-green rounded-xl p-4 mb-4 border border-primary-500/20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{CATEGORY_ICONS[product.category]}</span>
            <div>
              <div className="text-white font-semibold">{product.name}</div>
              <div className="text-gray-400 text-sm">by {product.farmerName} · {product.location}</div>
            </div>
          </div>
          <div className="text-primary-300 font-bold">₹{product.price?.toLocaleString()} / {product.unit}</div>
        </div>
        <div className="mb-4">
          <label className="text-sm text-gray-400 mb-2 block">Quantity ({product.unit})</label>
          <input type="number" value={qty} onChange={e => setQty(Math.max(1, Math.min(product.quantity, parseInt(e.target.value) || 1)))}
            min={1} max={product.quantity} className="input-field" />
          <p className="text-gray-500 text-xs mt-1">Max available: {product.quantity} {product.unit}</p>
        </div>
        <div className="glass rounded-xl p-3 mb-5 border border-white/10">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Amount</span>
            <span className="text-primary-300 font-bold text-lg">₹{total.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={() => onConfirm(product._id, qty)} className="btn-primary flex-1">Confirm Order</button>
        </div>
      </motion.div>
    </div>
  );
};

const AddProductModal = ({ onClose, onAdd }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...emptyForm, location: user?.location || '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/products', form);
      onAdd(res.data.product);
      toast.success('Product listed successfully! 🌾');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="glass rounded-2xl p-6 w-full max-w-lg border border-primary-500/20 my-4" onClick={e => e.stopPropagation()}>
        <h3 className="font-display text-xl font-bold text-white mb-6">List Your Produce</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Product Name *</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Fresh Tomatoes" required className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Category *</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field">
                {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Fresh, sun-grown tomatoes from organic farm..." rows={2} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="1500" required min="0" className="input-field" />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Unit *</label>
              <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="input-field">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Qty Available *</label>
              <input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="100" required min="0" className="input-field" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Location *</label>
            <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g., Nashik, Maharashtra" required className="input-field" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isOrganic} onChange={e => setForm({...form, isOrganic: e.target.checked})}
              className="w-4 h-4 accent-primary-500" />
            <span className="text-gray-300 text-sm">🌱 This is organically grown produce</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Listing...</> : '📢 List Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default function Marketplace() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [orderProduct, setOrderProduct] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [view, setView] = useState('all');

  const fetchProducts = useCallback(async () => {
    try {
      const params = {};
      if (category !== 'all') params.category = category;
      const res = await api.get('/api/products', { params });
      setProducts(res.data.products || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [category]);

  const fetchMyProducts = useCallback(async () => {
    try {
      const res = await api.get('/api/products/my-products');
      setProducts(res.data.products || []);
    } catch {
      toast.error('Failed to load your products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if (view === 'mine') fetchMyProducts();
    else fetchProducts();
  }, [category, view, fetchProducts, fetchMyProducts]);

  const handleOrder = async (productId, quantity) => {
    try {
      const res = await api.post(`/api/products/${productId}/order`, { quantity });
      toast.success(`Order placed! Total: ₹${res.data.order.totalPrice.toLocaleString()} 🎉`);
      setOrderProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm('Remove this listing?')) return;
    try {
      await api.delete(`/api/products/${productId}`);
      toast.success('Listing removed');
      setProducts(prev => prev.filter(p => p._id !== productId));
    } catch {
      toast.error('Failed to remove listing');
    }
  };

  const filteredProducts = products.filter(p =>
    search ? p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()) : true
  );

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-white">Farmer Marketplace</h1>
              <p className="text-gray-400 mt-1">Direct farm-to-buyer · Zero middlemen · Better prices</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setView('all'); setCategory('all'); }} className={`px-4 py-2 rounded-xl text-sm border transition-all ${view === 'all' ? 'border-primary-500 bg-primary-500/20 text-primary-300' : 'border-white/10 glass text-gray-400'}`}>
                🛒 All Products
              </button>
              <button onClick={() => setView('mine')} className={`px-4 py-2 rounded-xl text-sm border transition-all ${view === 'mine' ? 'border-primary-500 bg-primary-500/20 text-primary-300' : 'border-white/10 glass text-gray-400'}`}>
                👨‍🌾 My Listings
              </button>
              <button onClick={() => setShowAdd(true)} className="btn-primary text-sm px-4 py-2">
                + List Produce
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search + Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crops, locations..."
              className="input-field pl-9" />
          </div>
          {view === 'all' && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm border transition-all capitalize ${category === cat ? 'border-primary-500 bg-primary-500/20 text-primary-300' : 'border-white/10 glass text-gray-400 hover:border-white/20'}`}>
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-3 w-3/4" />
                <div className="h-3 bg-white/5 rounded mb-2" />
                <div className="h-3 bg-white/5 rounded w-1/2 mb-4" />
                <div className="h-10 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌾</div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              {view === 'mine' ? 'No listings yet' : 'No products found'}
            </h3>
            <p className="text-gray-400 mb-6">{view === 'mine' ? 'Start by listing your produce!' : 'Try a different category or search term.'}</p>
            <button onClick={() => setShowAdd(true)} className="btn-primary">+ List Your Produce</button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">{filteredProducts.length} products found</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onOrder={setOrderProduct}
                    onDelete={handleDelete}
                    isOwner={product.farmer === user?.id || product.farmer?._id === user?.id}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {orderProduct && <OrderModal product={orderProduct} onClose={() => setOrderProduct(null)} onConfirm={handleOrder} />}
        {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdd={p => { setProducts(prev => [p, ...prev]); }} />}
      </AnimatePresence>
    </div>
  );
}
