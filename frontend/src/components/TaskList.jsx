import { useState } from 'react';
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
  ArrowUpDown
} from 'lucide-react';
import TaskDetail from './TaskDetail';
import { TaskListSkeleton } from './ui/Loading';
import { filterTasks, getUniqueCategories, sortTasks, sortTypes } from '../utils/filters';
import { TaskFilters } from './TaskFilters';
import { CategorySelect } from './CategorySelect';
import { statusCategories, getCategoryById, getTagLabel, getCategoryColors } from '../utils/categories';
import { statusApi } from '../services/api';
import { useToast } from '../contexts/ToastContext';

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

// カテゴリーバッジコンポーネント
const CategoryBadge = ({ category, tag }) => {
  if (!category) return null;
  
  const categoryInfo = getCategoryById(category);
  if (!categoryInfo) return null;

  const { text: textColor, bg: bgColor } = getCategoryColors(category);
  const tagLabel = getTagLabel(category, tag);
  const Icon = categoryInfo.icon;

  return (
    <div className={`inline-flex items-center gap-1 ${bgColor} ${textColor} px-2 py-0.5 rounded-lg text-sm`}>
      <Icon className="w-3 h-3" />
      <span>{categoryInfo.label}</span>
      {tagLabel && (
        <span className="text-xs opacity-75">
          • {tagLabel}
        </span>
      )}
    </div>
  );
};

function TaskList({ tasks, onAddTask, onToggleTask, onDeleteTask, onUpdateTask, isLoading, isInitialLoading }) {
  const { addToast } = useToast();
  const [newTask, setNewTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dueDate: 'all',
    category: null
  });
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortType, setSortType] = useState('dueDate');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim() && selectedCategory && selectedTag) {
      onAddTask({
        title: newTask.trim(),
        completed: false,
        dueDate,
        priority,
        category: selectedCategory,
        tag: selectedTag,
      });
      setNewTask('');
      setDueDate('');
      setPriority('medium');
      setSelectedCategory('');
      setSelectedTag('');
      setShowAddForm(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleToggleTask = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      await onToggleTask(taskId);
      
      if (!task.completed) {
        // タスクが完了状態になった場合、ステータスを取得して更新を通知
        const updatedStatus = await statusApi.fetchStatus();
        const category = getCategoryById(task.category);
        if (category) {
          addToast(`${category.label}のステータスが上昇しました！`, 'success');
        }
      }
    } catch (error) {
      addToast('タスクの更新中にエラーが発生しました', 'error');
    }
  };

  const categories = getUniqueCategories(tasks);
  const processedTasks = sortTasks(filterTasks(tasks, filters, search), sortType);

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
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="px-4 py-2 rounded-xl border-0 bg-white text-gray-600 focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {Object.entries(sortTypes).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            <CategorySelect
              selectedCategory={selectedCategory}
              selectedTag={selectedTag}
              onCategoryChange={setSelectedCategory}
              onTagChange={setSelectedTag}
            />

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
                disabled={isLoading || !selectedCategory || !selectedTag}
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
          {processedTasks.map(task => (
            <div
              key={task._id}
              className="group flex items-center gap-4 card hover:shadow-md transition-all duration-200"
            >
              <button
                onClick={() => handleToggleTask(task._id)}
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
                <div className="flex items-center gap-2 mb-2">
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
                <div className="flex flex-wrap gap-2 items-center">
                  {task.dueDate && (
                    <span className="inline-flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {task.category && (
                    <CategoryBadge category={task.category} tag={task.tag} />
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
          {processedTasks.length === 0 && (
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