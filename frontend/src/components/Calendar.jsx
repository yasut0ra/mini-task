import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Tag,
  MoreHorizontal
} from 'lucide-react';
import TaskDetail from './TaskDetail';

// 優先度の色を取得する関数
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': return 'text-red-500 bg-red-50';
    case 'medium': return 'text-yellow-500 bg-yellow-50';
    case 'low': return 'text-green-500 bg-green-50';
    default: return 'text-gray-400 bg-gray-50';
  }
};

// カテゴリーの色を取得する関数
const getCategoryColor = (category) => {
  switch (category) {
    case '仕事': return 'text-blue-600 bg-blue-50';
    case '個人': return 'text-purple-600 bg-purple-50';
    case '買い物': return 'text-green-600 bg-green-50';
    case '勉強': return 'text-yellow-600 bg-yellow-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

function Calendar({ tasks, setTasks, onUpdateTask, onDeleteTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // 月の最初の日を取得
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startingDay = firstDay.getDay();

  // 月の最後の日を取得
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();

  // カレンダーの日付配列を作成
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startingDay + 1;
    if (dayNumber < 1 || dayNumber > totalDays) return null;
    return dayNumber;
  });

  // 月を変更する関数
  const changeMonth = (offset) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  // 今日に戻る関数
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 特定の日付のタスクを取得
  const getTasksForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task =>
      task._id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // 今日の日付
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  const handleTaskClick = (e, task) => {
    e.stopPropagation(); // イベントの伝播を停止
    setSelectedTask(task);
  };

  const handleTaskUpdate = async (updatedTask) => {
    if (onUpdateTask) {
      await onUpdateTask(updatedTask);
    }
    setSelectedTask(null);
  };

  const handleTaskDelete = async (taskId) => {
    if (onDeleteTask) {
      await onDeleteTask(taskId);
    }
    setSelectedTask(null);
  };

  // タスクカードのレンダリング
  const TaskCard = ({ task }) => {
    const priorityColor = getPriorityColor(task.priority);
    const categoryColor = task.category ? getCategoryColor(task.category) : '';

    return (
      <button
        onClick={(e) => handleTaskClick(e, task)}
        className={`
          w-full text-left text-xs p-1.5 rounded
          ${task.completed ? 'opacity-50' : ''}
          hover:bg-gray-100 transition-all duration-200
          group relative
        `}
      >
        <div className="flex items-center gap-1">
          <CheckCircle 
            className={`w-3 h-3 flex-shrink-0 ${
              task.completed ? 'text-green-500' : 'text-gray-400'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              toggleTask(task._id);
            }}
          />
          <span className="truncate flex-1">{task.title}</span>
          <Star className={`w-3 h-3 flex-shrink-0 ${priorityColor.split(' ')[0]}`} />
        </div>

        {/* ホバー時に表示される詳細情報 */}
        <div className="
          absolute left-0 right-0 bottom-full mb-1 p-2 rounded-lg
          bg-white shadow-lg border border-gray-200
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 z-10
          text-xs
        ">
          <div className="font-medium mb-1">{task.title}</div>
          <div className="flex flex-wrap gap-1">
            {task.category && (
              <span className={`px-1.5 py-0.5 rounded-md ${categoryColor}`}>
                {task.category}
              </span>
            )}
            <span className={`px-1.5 py-0.5 rounded-md ${priorityColor}`}>
              {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {new Date(currentYear, currentMonth).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="前月"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                isCurrentMonth
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <span className="text-sm font-medium">今日</span>
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="翌月"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        <CalendarIcon className="w-6 h-6 text-gray-400" />
      </div>

      {/* カレンダーグリッド */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
            <div
              key={day}
              className={`py-2 text-center text-sm font-medium ${
                index === 0 ? 'text-red-500' : 
                index === 6 ? 'text-blue-500' : 
                'text-gray-500'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* カレンダー日付 */}
        <div className="grid grid-cols-7 divide-x divide-y">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-32 bg-gray-50" />;
            }

            const date = new Date(currentYear, currentMonth, day);
            const isToday = date.toDateString() === today.toDateString();
            const tasksForDay = getTasksForDate(day);
            const isWeekend = index % 7 === 0 || index % 7 === 6;

            // 表示するタスクの最大数
            const maxVisibleTasks = 3;
            const hasMoreTasks = tasksForDay.length > maxVisibleTasks;
            const visibleTasks = tasksForDay.slice(0, maxVisibleTasks);

            return (
              <div
                key={index}
                className={`h-32 p-2 ${
                  isToday ? 'bg-indigo-50' : 
                  isWeekend ? 'bg-gray-50/50' : ''
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-indigo-600' :
                  index % 7 === 0 ? 'text-red-500' :
                  index % 7 === 6 ? 'text-blue-500' :
                  'text-gray-900'
                }`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {visibleTasks.map(task => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                  {hasMoreTasks && (
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <MoreHorizontal className="w-3 h-3" />
                      <span>他{tasksForDay.length - maxVisibleTasks}件</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* タスク詳細モーダル */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </div>
  );
}

export default Calendar; 