import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Calendar,
  Tag,
  Star,
  Search,
  Filter,
  ExternalLink,
  ArrowUpDown,
  Clock
} from 'lucide-react';
import TaskDetail from './TaskDetail';
import { TaskListSkeleton } from './ui/Loading';
import { filterTasks, getUniqueCategories } from '../utils/filters';
import { TaskFilters } from './TaskFilters';
import { TaskSort } from './TaskSort';
import { sortTasks, loadSortConfig, saveSortConfig } from '../utils/sorting';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-400';
  }
};

const getCategoryBadgeColor = (category) => {
  switch (category) {
    case '仕事': return 'bg-blue-50 text-blue-600';
    case '個人': return 'bg-purple-50 text-purple-600';
    case '買い物': return 'bg-green-50 text-green-600';
    case '勉強': return 'bg-yellow-50 text-yellow-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, isLoading, isInitialLoading }) {
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dueDate: 'all',
    category: null
  });
  const [sortConfig, setSortConfig] = useState(loadSortConfig());
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    saveSortConfig(sortConfig);
  }, [sortConfig]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask({
        title: newTask.trim(),
        completed: false,
        dueDate,
        priority,
        category: category.trim() || undefined,
      });
      setNewTask('');
      setDueDate('');
      setPriority('medium');
      setCategory('');
      setShowAddForm(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  const categories = getUniqueCategories(tasks);
  const filteredTasks = filterTasks(tasks, filters, search);
  const sortedTasks = sortTasks(filteredTasks, sortConfig);

  return (
    <div className="space-y-6">
      {/* 検索とフィルターバー */}
      <div className={isInitialLoading ? 'opacity-50 pointer-events-none' : ''}>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="タスクを検索..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border-0 bg-white/50 shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSort(!showSort)}
              className={`p-2 rounded-xl transition-colors duration-200 ${
                showSort ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ArrowUpDown className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-xl transition-colors duration-200 ${
                showFilters ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ソートパネル */}
      {showSort && (
        <TaskSort
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
        />
      )}

      {/* フィルターパネル */}
      {showFilters && (
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          categories={categories}
        />
      )}

      {/* タスク追加ボタン */}
      {!isInitialLoading && !showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 rounded-xl border-2 border-dashed border-indigo-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>新しいタスクを追加</span>
        </button>
      )}

      {/* タスク入力フォーム */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="card">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="タスクを入力..."
                className="input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">期限</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリー</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="カテゴリーを入力..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? '追加中...' : '追加'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* タスクリスト */}
      {isInitialLoading ? (
        <TaskListSkeleton />
      ) : (
        <div className="space-y-3">
          {sortedTasks.map(task => (
            <div
              key={task._id}
              className="group flex items-center gap-4 card"
            >
              <button
                onClick={() => onToggleTask(task._id)}
                disabled={isLoading}
                className="flex-shrink-0 focus:outline-none transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {task.completed ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors duration-200" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="font-medium truncate hover:text-indigo-600 transition-colors duration-200 flex items-center gap-1"
                  >
                    <span className={task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}>
                      {task.title}
                    </span>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </button>
                  <Star className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {task.dueDate && (
                    <span className="inline-flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Tag className="w-3 h-3 mr-1" />
                      {task.category}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDeleteTask(task._id)}
                disabled={isLoading}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 focus:outline-none transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {sortedTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <Filter className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-gray-500 font-medium">
                {search
                  ? '検索結果が見つかりません'
                  : 'タスクがありません。新しいタスクを追加してください。'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* タスク詳細モーダル */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      )}
    </div>
  );
}

export default TaskList; 