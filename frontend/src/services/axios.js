import axios from 'axios';
import { store } from '../store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // トークンがある場合はヘッダーに追加
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // トークン期限切れの場合
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // リフレッシュトークンを使用して新しいトークンを取得
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        
        // 新しいトークンを保存
        localStorage.setItem('token', token);
        
        // 元のリクエストを再試行
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // リフレッシュトークンも期限切れの場合はログアウト
        store.dispatch({ type: 'SET_ERROR', payload: 'セッションが期限切れです。再度ログインしてください。' });
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // その他のエラー
    const errorMessage = error.response?.data?.message || 'エラーが発生しました';
    store.dispatch({ type: 'SET_ERROR', payload: errorMessage });
    return Promise.reject(error);
  }
);

export default api; 