import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const NavLink = ({ to, children, onClick }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`nav-link px-3 py-2 rounded-lg transition-all duration-200 ${
        active ? 'text-primary-400 bg-primary-500/10' : 'hover:bg-white/5'
      }`}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/5 shadow-xl shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-sm shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
              🌱
            </div>
            <span className="font-display text-lg font-bold gradient-text hidden sm:block">AgriNova AI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/cold-storage">Cold Storage</NavLink>
                <NavLink to="/marketplace">Marketplace</NavLink>
                <NavLink to="/analytics">Analytics</NavLink>
              </>
            ) : (
              <>
                <a href="#features" className="nav-link px-3 py-2 rounded-lg hover:bg-white/5">Features</a>
                <a href="#impact" className="nav-link px-3 py-2 rounded-lg hover:bg-white/5">Impact</a>
                <a href="#about" className="nav-link px-3 py-2 rounded-lg hover:bg-white/5">About</a>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-sm">
                    <div className="text-white font-medium leading-none">{user?.name?.split(' ')[0]}</div>
                    <div className="text-gray-500 text-xs capitalize">{user?.role}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm px-4 py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg glass text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden glass rounded-2xl mb-4 p-4 flex flex-col gap-2"
            >
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 pb-3 mb-2 border-b border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{user?.name}</div>
                      <div className="text-gray-400 text-xs capitalize">{user?.role}</div>
                    </div>
                  </div>
                  <NavLink to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                  <NavLink to="/cold-storage" onClick={() => setMobileOpen(false)}>Cold Storage</NavLink>
                  <NavLink to="/marketplace" onClick={() => setMobileOpen(false)}>Marketplace</NavLink>
                  <NavLink to="/analytics" onClick={() => setMobileOpen(false)}>Analytics</NavLink>
                  <button onClick={handleLogout} className="text-left text-red-400 px-3 py-2 text-sm hover:bg-red-500/10 rounded-lg transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="#features" onClick={() => setMobileOpen(false)} className="nav-link px-3 py-2">Features</a>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="nav-link px-3 py-2">Login</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm mt-1">Get Started</Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
