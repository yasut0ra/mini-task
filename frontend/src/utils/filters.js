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

export const filterTasks = (tasks, filters, search) => {
  return tasks.filter(task => {
    // ステータスでフィルタリング
    if (filters.status !== 'all') {
      if (filters.status === 'active' && task.completed) return false;
      if (filters.status === 'completed' && !task.completed) return false;
    }

    // 優先度でフィルタリング
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // 期限でフィルタリング
    if (filters.dueDate !== 'all' && task.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      switch (filters.dueDate) {
        case 'today':
          if (dueDate.getTime() !== today.getTime()) return false;
          break;
        case 'week': {
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          if (dueDate < today || dueDate > weekEnd) return false;
          break;
        }
        case 'month': {
          const monthEnd = new Date(today);
          monthEnd.setMonth(today.getMonth() + 1);
          if (dueDate < today || dueDate > monthEnd) return false;
          break;
        }
        case 'overdue':
          if (dueDate >= today) return false;
          break;
      }
    }

    // カテゴリーでフィルタリング
    if (filters.category && task.category !== filters.category) {
      return false;
    }

    // 検索文字列でフィルタリング
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        (task.category && task.category.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });
};

// カテゴリー一覧を取得
export const getUniqueCategories = (tasks) => {
  const categories = new Set(tasks.filter(task => task.category).map(task => task.category));
  return Array.from(categories);
}; 