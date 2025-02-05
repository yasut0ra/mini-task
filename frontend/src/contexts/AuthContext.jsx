import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初期ロード時にユーザー情報を取得
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
      } catch (error) {
        console.error('認証エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ログイン
  const login = async (email, password) => {
    const data = await authApi.login(email, password);
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
    await authApi.logout();
    setUser(null);
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