import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('agrinova_token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('agrinova_token');
      const savedUser = localStorage.getItem('agrinova_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data.user);
          localStorage.setItem('agrinova_user', JSON.stringify(res.data.user));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('agrinova_token', newToken);
      localStorage.setItem('agrinova_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      toast.success(`Welcome back, ${newUser.name}! 🌱`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post('/api/auth/register', data);
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('agrinova_token', newToken);
      localStorage.setItem('agrinova_user', JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      toast.success(`Welcome to AgriNova AI, ${newUser.name}! 🚀`);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('agrinova_token');
    localStorage.removeItem('agrinova_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('agrinova_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
