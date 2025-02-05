import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

// Axios インスタンスの作成
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// エラーハンドリング用のヘルパー関数
const handleError = (error) => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || 'エラーが発生しました';
  throw new Error(message);
};

// タスク関連の API 関数
export const taskApi = {
  // タスク一覧の取得
  async fetchTasks() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの追加
  async createTask(taskData) {
    try {
      const response = await api.post('/', taskData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの更新
  async updateTask(id, taskData) {
    try {
      const response = await api.put(`/${id}`, taskData);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの部分更新（完了状態の切り替えなど）
  async toggleTaskStatus(id, completed) {
    try {
      const response = await api.patch(`/${id}`, { completed });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // タスクの削除
  async deleteTask(id) {
    try {
      await api.delete(`/${id}`);
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