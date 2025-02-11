import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { sortTypes } from '../utils/sorting';

export const TaskSort = ({ sortConfig, onSortChange }) => {
  const handleSortClick = (type) => {
    if (sortConfig.type === type) {
      // 同じタイプの場合は方向を切り替え
      onSortChange({
        type,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // 新しいタイプの場合はデフォルトで降順
      onSortChange({
        type,
        direction: 'desc'
      });
    }
  };

  const getSortIcon = (type) => {
    if (sortConfig.type !== type) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-indigo-600" />
      : <ArrowDown className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-xl shadow-sm">
      {Object.entries(sortTypes).map(([key, { label }]) => (
        <button
          key={key}
          onClick={() => handleSortClick(key)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
            transition-all duration-200
            ${sortConfig.type === key
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }
          `}
        >
          {label}
          {getSortIcon(key)}
        </button>
      ))}
    </div>
  );
}; 