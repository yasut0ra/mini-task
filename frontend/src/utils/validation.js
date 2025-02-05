export const validateTask = (task) => {
  const errors = {};

  // タイトルのバリデーション
  if (!task.title) {
    errors.title = 'タイトルは必須です';
  } else if (task.title.length > 100) {
    errors.title = 'タイトルは100文字以内で入力してください';
  }

  // 期限のバリデーション
  if (task.dueDate) {
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = '有効な日付を入力してください';
    }
  }

  // 優先度のバリデーション
  if (task.priority && !['low', 'medium', 'high'].includes(task.priority)) {
    errors.priority = '有効な優先度を選択してください';
  }

  // カテゴリーのバリデーション
  if (task.category && task.category.length > 20) {
    errors.category = 'カテゴリーは20文字以内で入力してください';
  }

  return errors;
}; 