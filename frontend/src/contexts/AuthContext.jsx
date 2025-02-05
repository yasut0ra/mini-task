import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);

  // 初期ロード時にユーザー情報を取得
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const data = await authApi.getCurrentUser();
        setUser(data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          setTokenExpired(true);
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // トークン期限切れの監視
  useEffect(() => {
    if (tokenExpired) {
      logout();
    }
  }, [tokenExpired]);

  // ログイン
  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  // 登録
  const register = async (userData) => {
    const data = await authApi.register(userData);
    setUser(data.user);
    return data;
  };

  // ログアウト
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      setTokenExpired(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 