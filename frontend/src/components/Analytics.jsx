import { PieChart, BarChart, Activity } from 'lucide-react';

function Analytics({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const incompleteTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {});

  const tasksByCategory = tasks.reduce((acc, task) => {
    if (task.category) {
      acc[task.category] = (acc[task.category] || 0) + 1;
    }
    return acc;
  }, {});

  const overdueTasks = tasks.filter(task => 
    task.dueDate && !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">タスク分析</h2>

      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">総タスク数</h3>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">完了率</h3>
            <PieChart className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{completionRate.toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">未完了</h3>
            <BarChart className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{incompleteTasks}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">期限超過</h3>
            <Activity className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{overdueTasks}</p>
        </div>
      </div>

      {/* 詳細分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 優先度分布 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">優先度別タスク数</h3>
          <div className="space-y-4">
            {Object.entries(tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-500">
                  {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
                </div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      priority === 'high'
                        ? 'bg-red-500'
                        : priority === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(count / totalTasks) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-900">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* カテゴリー分布 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">カテゴリー別タスク数</h3>
          <div className="space-y-4">
            {Object.entries(tasksByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center gap-4">
                <div className="w-24 truncate text-sm font-medium text-gray-500">
                  {category}
                </div>
                <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${(count / totalTasks) * 100}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm font-medium text-gray-900">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics; 