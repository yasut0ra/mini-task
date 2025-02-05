import api from './axios';

export const userApi = {
  // プロフィールの更新
  async updateProfile(userData) {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // パスワードの変更
  async updatePassword(currentPassword, newPassword) {
    const response = await api.put('/users/password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
}; 