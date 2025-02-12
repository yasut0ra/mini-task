// ソートの種類を定義
export const sortTypes = {
  priority: {
    key: 'priority',
    label: '優先度',
    order: ['high', 'medium', 'low']
  },
  dueDate: {
    key: 'dueDate',
    label: '期限',
  },
  createdAt: {
    key: 'createdAt',
    label: '作成日'
  },
  category: {
    key: 'category',
    label: 'カテゴリー'
  },
  completed: {
    key: 'completed',
    label: '完了状態'
  }
};

// ソート関数
export const sortTasks = (tasks, sortConfig) => {
  const { type, direction } = sortConfig;
  
  return [...tasks].sort((a, b) => {
    let comparison = 0;

    switch (type) {
      case 'priority': {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      }
      
      case 'dueDate': {
        const dateA = a.dueDate ? new Date(a.dueDate) : new Date('9999-12-31');
        const dateB = b.dueDate ? new Date(b.dueDate) : new Date('9999-12-31');
        comparison = dateA - dateB;
        break;
      }
      
      case 'createdAt': {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        comparison = dateA - dateB;
        break;
      }
      
      case 'category': {
        const categoryA = a.category || '';
        const categoryB = b.category || '';
        comparison = categoryA.localeCompare(categoryB);
        break;
      }
      
      case 'completed': {
        comparison = (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
        break;
      }
      
      default:
        return 0;
    }

    return direction === 'asc' ? comparison : -comparison;
  });
};

// ソート設定をローカルストレージに保存
export const saveSortConfig = (sortConfig) => {
  localStorage.setItem('taskSortConfig', JSON.stringify(sortConfig));
};

// ソート設定をローカルストレージから読み込み
export const loadSortConfig = () => {
  const saved = localStorage.getItem('taskSortConfig');
  return saved ? JSON.parse(saved) : { type: 'createdAt', direction: 'desc' };
}; 