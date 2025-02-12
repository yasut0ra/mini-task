import { useState } from 'react';
import { 
  Calendar,
  Tag,
  Star,
  MessageSquare,
  Clock,
  ArrowLeft,
  Save,
  Trash2,
  X,
  Edit
} from 'lucide-react';
import { statusCategories, getCategoryById } from '../utils/constants';
import { validateTask } from '../utils/validation';
import { LoadingSpinner, TaskDetailSkeleton } from './ui/Loading';
import { TaskComments } from './TaskComments';

function TaskDetail({ task, onClose, onUpdate, onDelete, isLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // バリデーションチェック
    const validationErrors = validateTask(editedTask);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onUpdate(editedTask);
    setIsEditing(false);
    setErrors({});
  };

  const handleCancel = () => {
    setEditedTask(task);
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = {
      年: 31536000,
      ヶ月: 2592000,
      週間: 604800,
      日: 86400,
      時間: 3600,
      分: 60,
      秒: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval}${unit}前`;
      }
    }
    return 'たった今';
  };

  // 入力フィールドが変更されるたびにエラーをクリア
  const handleInputChange = (field, value) => {
    setEditedTask({ ...editedTask, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-scale-up">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                  disabled={isLoading}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner className="w-5 h-5" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  保存
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors duration-200 flex items-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  編集
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('このタスクを削除してもよろしいですか？')) {
                      onDelete(task._id);
                      onClose();
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isLoading ? (
            <TaskDetailSkeleton />
          ) : (
            <>
              {/* タスクタイトル */}
              <div>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={editedTask.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`w-full text-xl font-semibold px-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 ${
                        errors.title ? 'ring-2 ring-red-500' : 'focus:ring-indigo-500'
                      }`}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </>
                ) : (
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {task.title}
                    <Star className={`w-5 h-5 ${getPriorityColor(task.priority)}`} />
                  </h2>
                )}
              </div>

              {/* タスク詳細 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  {/* 期限 */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={editedTask.dueDate || ''}
                          onChange={(e) => handleInputChange('dueDate', e.target.value)}
                          className={`px-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 ${
                            errors.dueDate ? 'ring-2 ring-red-500' : 'focus:ring-indigo-500'
                          }`}
                        />
                        <input
                          type="time"
                          value={editedTask.dueTime || ''}
                          onChange={(e) => handleInputChange('dueTime', e.target.value)}
                          className={`px-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 ${
                            errors.dueTime ? 'ring-2 ring-red-500' : 'focus:ring-indigo-500'
                          }`}
                        />
                      </div>
                    ) : (
                      <span className="text-gray-600">
                        {task.dueDate ? (
                          <>
                            {new Date(task.dueDate).toLocaleDateString()}
                            {task.dueTime && ` ${task.dueTime}`}
                          </>
                        ) : (
                          '期限なし'
                        )}
                      </span>
                    )}
                    {errors.dueDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
                    )}
                    {errors.dueTime && (
                      <p className="mt-1 text-sm text-red-500">{errors.dueTime}</p>
                    )}
                  </div>

                  {/* 優先度 */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Star className="w-5 h-5 text-indigo-600" />
                    </div>
                    {isEditing ? (
                      <select
                        value={editedTask.priority}
                        onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                        className="flex-1 px-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="low">低</option>
                        <option value="medium">中</option>
                        <option value="high">高</option>
                      </select>
                    ) : (
                      <span className="text-gray-600">
                        {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                      </span>
                    )}
                  </div>

                  {/* カテゴリー */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Tag className="w-5 h-5 text-indigo-600" />
                    </div>
                    {isEditing ? (
                      <select
                        value={editedTask.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 focus:ring-indigo-500"
                      >
                        {statusCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-600">
                        {task.category ? getCategoryById(task.category)?.label : 'カテゴリーなし'}
                      </span>
                    )}
                  </div>

                  {/* 作成日時 */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="text-gray-600">
                      作成: {getTimeAgo(task.createdAt)}
                    </span>
                  </div>
                </div>

                {/* コメントセクション */}
                <div className="space-y-4">
                  <TaskComments taskId={task._id} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskDetail; 