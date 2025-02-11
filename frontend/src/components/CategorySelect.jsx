import { useState } from 'react';
import { statusCategories, getTagsByCategory } from '../utils/categories';

export const CategorySelect = ({ 
  selectedCategory, 
  selectedTag, 
  onCategoryChange, 
  onTagChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const category = statusCategories.find(c => c.id === selectedCategory);
  const tags = getTagsByCategory(selectedCategory);

  return (
    <div className="space-y-4">
      {/* カテゴリー選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          カテゴリー
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-4 py-2 border rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {category ? (
              <div className="flex items-center gap-2">
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <span>{category.label}</span>
              </div>
            ) : (
              <span className="text-gray-500">カテゴリーを選択</span>
            )}
          </button>

          {/* カテゴリーリスト */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {statusCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onCategoryChange(category.id);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors duration-200"
                >
                  <category.icon className={`w-5 h-5 ${category.color}`} />
                  <div className="text-left">
                    <div className="font-medium">{category.label}</div>
                    <div className="text-sm text-gray-500">{category.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* タグ選択 */}
      {selectedCategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            タグ
          </label>
          <select
            value={selectedTag || ''}
            onChange={(e) => onTagChange(e.target.value)}
            className="w-full rounded-xl border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">タグを選択</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}; 