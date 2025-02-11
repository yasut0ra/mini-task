import axios from 'axios';
import { store } from '../store/index.jsx';

const API_URL = import.meta.env.VITE_API_URL;

// Axios インスタンスの作成
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// リクエストインターセプターを追加
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

// タスク関連の API 関数
export const taskApi = {
  // タスク一覧の取得
  async fetchTasks() {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの追加
  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの更新
  async updateTask(id, taskData) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの部分更新（完了状態の切り替えなど）
  async toggleTaskStatus(id, completed) {
    try {
      const response = await api.patch(`/tasks/${id}`, { completed });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの削除
  async deleteTask(id) {
    try {
      await api.delete(`/tasks/${id}`);
      return true;
    } catch (error) {
      handleError(error);
    }
  },
};

// コメント関連のAPI関数
export const commentApi = {
  // タスクのコメント一覧を取得
  async fetchComments(taskId) {
    try {
      const response = await api.get(`/comments/task/${taskId}`);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // コメントを追加
  async createComment(taskId, text) {
    try {
      const response = await api.post('/comments', { taskId, text });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // コメントを更新
  async updateComment(id, text) {
    try {
      const response = await api.put(`/comments/${id}`, { text });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // コメントを削除
  async deleteComment(id) {
    try {
      await api.delete(`/comments/${id}`);
      return true;
    } catch (error) {
      handleError(error);
    }
  },
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

// ステータス関連のAPI関数
export const statusApi = {
  // ユーザーのステータス情報を取得
  async fetchStatus() {
    try {
      const response = await api.get('/tasks/status');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
}; 