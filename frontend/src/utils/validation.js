import { statusCategories } from './constants';

export const validateTask = (task) => {
  const errors = {};

  // タイトルのバリデーション
  if (!task.title || !task.title.trim()) {
    errors.title = 'タイトルは必須です';
  } else if (task.title.length > 100) {
    errors.title = 'タイトルは100文字以内で入力してください';
  }

  // 期限日のバリデーション
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = '有効な日付を入力してください';
    } else if (dueDate < new Date().setHours(0, 0, 0, 0)) {
      errors.dueDate = '期限を過去の日付に設定することはできません';
    }
  }

  // 期限時間のバリデーション
  if (task.dueTime) {
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(task.dueTime)) {
      errors.dueTime = '有効な時間を入力してください（HH:MM形式）';
    }
  }

  // 優先度のバリデーション
  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = '優先度は low, medium, high のいずれかを選択してください';
  }

  // カテゴリーのバリデーション
  if (!task.category) {
    errors.category = 'カテゴリーは必須です';
  } else if (!statusCategories.some(cat => cat.id === task.category)) {
    errors.category = '有効なカテゴリーを選択してください';
  }

  return errors;
}; 