import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const authApi = {
  // ユーザー登録
  async register(userData) {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  },

  // ログイン
  async login(email, password) {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  // ログアウト
  async logout() {
    const response = await axios.get(`${API_URL}/auth/logout`);
    return response.data;
  },

  // 現在のユーザー情報を取得
  async getCurrentUser() {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
  }
}; 