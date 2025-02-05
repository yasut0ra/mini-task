import { Calendar as CalendarIcon, CheckCircle } from 'lucide-react';

function Calendar({ tasks, setTasks }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {new Date(currentYear, currentMonth).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })}
        </h2>
        <CalendarIcon className="w-6 h-6 text-gray-400" />
      </div>

      {/* カレンダーグリッド */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {['日', '月', '火', '水', '木', '金', '土'].map(day => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-gray-500"
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

            return (
              <div
                key={index}
                className={`h-32 p-2 ${isToday ? 'bg-indigo-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-indigo-600' : 'text-gray-900'
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