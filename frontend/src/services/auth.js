import axios from 'axios';
import { store } from '../store/index.jsx';

const API_URL = import.meta.env.VITE_API_URL;

// Axios インスタンスの作成
const api = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// エラーハンドリング用のヘルパー関数
const handleError = (error) => {
  console.error('Auth API Error:', error);
  let message = 'エラーが発生しました';
  
  if (error.response) {
    message = error.response.data.message || `エラー: ${error.response.status}`;
  } else if (error.request) {
    message = 'サーバーに接続できません';
  } else {
    message = error.message;
  }

  store.dispatch({ type: 'SET_ERROR', payload: message });
  throw new Error(message);
};

export const authApi = {
  // ユーザー登録
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // ログイン
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // ユーザー情報の取得
  async getMe(token) {
    try {
      const response = await api.get('/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
}; 