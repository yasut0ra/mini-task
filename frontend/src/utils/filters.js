import { statusCategories } from './categories';

export const filterTypes = {
  status: {
    all: 'すべて',
    active: '未完了',
    completed: '完了済み'
  },
  priority: {
    all: 'すべて',
    high: '高',
    medium: '中',
    low: '低'
  },
  dueDate: {
    all: 'すべて',
    today: '今日',
    week: '今週',
    month: '今月',
    overdue: '期限切れ'
  }
};

// 日付関連のヘルパー関数
const isToday = (date) => {
  const today = new Date();
  const taskDate = new Date(date);
  return (
    taskDate.getDate() === today.getDate() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
};

const isThisWeek = (date) => {
  const today = new Date();
  const taskDate = new Date(date);
  const diffTime = Math.abs(taskDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
};

const isThisMonth = (date) => {
  const today = new Date();
  const taskDate = new Date(date);
  return (
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getFullYear() === today.getFullYear()
  );
};

const isOverdue = (date) => {
  const today = new Date();
  const taskDate = new Date(date);
  return taskDate < today;
};

// フィルタリング関数
export const filterTasks = (tasks, filters, search) => {
  return tasks.filter(task => {
    // 検索フィルター
    if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // 完了状態フィルター
    if (filters.status !== 'all') {
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'uncompleted' && task.completed) return false;
    }

    // 優先度フィルター
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // カテゴリーフィルター
    if (filters.category && task.category !== filters.category) {
      return false;
    }

    // 期限フィルター
    if (filters.dueDate !== 'all' && task.dueDate) {
      switch (filters.dueDate) {
        case 'today':
          if (!isToday(task.dueDate)) return false;
          break;
        case 'week':
          if (!isThisWeek(task.dueDate)) return false;
          break;
        case 'month':
          if (!isThisMonth(task.dueDate)) return false;
          break;
        case 'overdue':
          if (!isOverdue(task.dueDate)) return false;
          break;
      }
    }

    return true;
  });
};

// カテゴリー一覧の取得
export const getUniqueCategories = () => {
  return statusCategories.map(category => ({
    id: category.id,
    label: category.label
  }));
}; 