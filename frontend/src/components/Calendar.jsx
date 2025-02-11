import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

function Calendar({ tasks, setTasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
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
                  {tasksForDay.map(task => (
                    <button
                      key={task._id}
                      onClick={() => toggleTask(task._id)}
                      className={`w-full text-left text-xs p-1 rounded ${
                        task.completed
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-600 bg-gray-50'
                      } hover:bg-gray-100 transition-colors duration-200 flex items-center gap-1`}
                    >
                      <CheckCircle className={`w-3 h-3 ${
                        task.completed ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <span className="truncate">{task.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar; 