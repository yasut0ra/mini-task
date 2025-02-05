import { Filter, Calendar, Star, Tag } from 'lucide-react';
import { filterTypes } from '../utils/filters';

export function TaskFilters({ filters, onFilterChange, categories }) {
  return (
    <div className="card slide-down">
      {/* ステータスフィルター */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          ステータス
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterTypes.status).map(([value, label]) => (
            <button
              key={value}
              onClick={() => onFilterChange('status', value)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                filters.status === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 期限フィルター */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          期限
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterTypes.dueDate).map(([value, label]) => (
            <button
              key={value}
              onClick={() => onFilterChange('dueDate', value)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                filters.dueDate === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 優先度フィルター */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Star className="w-4 h-4" />
          優先度
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(filterTypes.priority).map(([value, label]) => (
            <button
              key={value}
              onClick={() => onFilterChange('priority', value)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                filters.priority === value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* カテゴリーフィルター */}
      {categories.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            カテゴリー
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onFilterChange('category', null)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                !filters.category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onFilterChange('category', category)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                  filters.category === category
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 