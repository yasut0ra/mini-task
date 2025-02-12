import axios from 'axios';
import { store } from '../store/index.jsx';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// APIインスタンスの作成
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
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
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// エラーハンドリング用のヘルパー関数
const handleError = (error) => {
  console.error('API Error:', error);
  let message = 'エラーが発生しました';
  
  if (error.response) {
    // サーバーからのエラーレスポンス
    message = error.response.data.message || `エラー: ${error.response.status}`;
    
    // 認証エラーの場合、ローカルストレージをクリア
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  } else if (error.request) {
    // リクエストは送信されたがレスポンスがない
    message = 'サーバーに接続できません';
  } else {
    // リクエストの作成時にエラー
    message = error.message;
  }

  // グローバルなエラー状態を更新
  store.dispatch({ type: 'SET_ERROR', payload: message });
  throw new Error(message);
};

// タスク関連のAPI
export const taskApi = {
  // タスク一覧の取得
  fetchTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // タスクの作成
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // タスクの更新
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // タスクの完了状態の切り替え
  toggleTaskStatus: async (id) => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },

  // タスクの削除
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

// 認証関連のAPI
export const authApi = {
  // ログイン
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // 新規登録
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // ログアウト
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // ユーザー情報の取得
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  }
};

// コメント関連のAPI
export const commentApi = {
  // コメント一覧の取得
  fetchComments: async (taskId) => {
    const response = await api.get(`/comments/${taskId}`);
    return response.data;
  },

  // コメントの作成
  createComment: async (taskId, text) => {
    const response = await api.post(`/comments/${taskId}`, { text });
    return response.data;
  },

  // コメントの更新
  updateComment: async (id, text) => {
    const response = await api.put(`/comments/${id}`, { text });
    return response.data;
  },

  // コメントの削除
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  }
};

// 分析関連のAPI関数
export const analyticsApi = {
  // 統計情報の取得
  async fetchStats() {
    try {
      const response = await api.get('/analytics/stats');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
}; 