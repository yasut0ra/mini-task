import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/auth';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const { user } = await authApi.getMe(token);
      setUser(user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      const { token, user } = await authApi.register(userData);
      localStorage.setItem('token', token);
      setUser(user);
      addToast('アカウントが作成されました', 'success');
      return true;
    } catch (error) {
      addToast(error.message, 'error');
      return false;
    }
  };

  const login = async (credentials) => {
    try {
      const { token, user } = await authApi.login(credentials);
      localStorage.setItem('token', token);
      setUser(user);
      addToast('ログインしました', 'success');
      return true;
    } catch (error) {
      addToast(error.message, 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    addToast('ログアウトしました', 'success');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 