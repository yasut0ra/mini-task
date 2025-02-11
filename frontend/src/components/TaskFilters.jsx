import { 
  Star, 
  Calendar as CalendarIcon,
  Tag,
  CheckCircle
} from 'lucide-react';
import { statusCategories } from '../utils/categories';

export const TaskFilters = ({ filters, onFilterChange }) => {
  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      {/* 完了状態フィルター */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>完了状態</span>
          </div>
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">すべて</option>
          <option value="completed">完了済み</option>
          <option value="uncompleted">未完了</option>
        </select>
      </div>

      {/* 優先度フィルター */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span>優先度</span>
          </div>
        </label>
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          className="w-full rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">すべて</option>
          <option value="high">高</option>
          <option value="medium">中</option>
          <option value="low">低</option>
        </select>
      </div>

      {/* カテゴリーフィルター */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>カテゴリー</span>
          </div>
        </label>
        <select
          value={filters.category || 'all'}
          onChange={(e) => onFilterChange('category', e.target.value === 'all' ? null : e.target.value)}
          className="w-full rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">すべて</option>
          {statusCategories.map(category => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* 期限フィルター */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>期限</span>
          </div>
        </label>
        <select
          value={filters.dueDate}
          onChange={(e) => onFilterChange('dueDate', e.target.value)}
          className="w-full rounded-lg border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">すべて</option>
          <option value="today">今日</option>
          <option value="week">今週</option>
          <option value="month">今月</option>
          <option value="overdue">期限切れ</option>
        </select>
      </div>
    </div>
  );
}; 