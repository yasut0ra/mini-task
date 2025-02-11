import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Tag,
  MoreHorizontal,
  LayoutGrid,
  Rows,
  Filter,
  X,
  GripHorizontal,
  Calendar as CalendarViewIcon
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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

// 新しい定数を追加して、時間スロット/セルの高さを統一する
const TIME_SLOT_HEIGHT = "h-16";

// ドラッグ可能なタスクカードコンポーネント
const DraggableTaskCard = ({ task, onTaskClick, onToggle }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { 
      taskId: task._id,
      originalDate: task.dueDate,
      title: task.title
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        // ドロップが無効な場合は元の位置に戻る視覚効果を追加
        const draggedElement = document.querySelector(`[data-task-id="${item.taskId}"]`);
        if (draggedElement) {
          draggedElement.style.transition = 'transform 0.3s ease-in-out';
          draggedElement.style.transform = 'translate(0, 0)';
        }
      }
    },
  }));

  const priorityColor = getPriorityColor(task.priority);
  const categoryColor = task.category ? getCategoryColor(task.category) : '';

  return (
    <div
      ref={drag}
      data-task-id={task._id}
      onClick={(e) => onTaskClick(e, task)}
      className={`
        w-full text-left text-xs p-1.5 rounded cursor-move
        ${task.completed ? 'opacity-50' : ''}
        ${isDragging ? 'opacity-25 scale-95' : ''}
        hover:bg-gray-100 transition-all duration-200
        group relative
        transform
      `}
      style={{
        transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out'
      }}
    >
      <div className="flex items-center gap-1">
        <GripHorizontal className="w-3 h-3 text-gray-400" />
        <CheckCircle 
          className={`w-3 h-3 flex-shrink-0 ${
            task.completed ? 'text-green-500' : 'text-gray-400'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(task._id);
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
    </div>
  );
};

// ドロップ可能な日付セルコンポーネント
const DroppableDateCell = ({ date, isToday, isWeekend, tasks, onTaskDrop, children }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'TASK',
    canDrop: (item) => {
      if (!item.originalDate) return true;
      const itemDate = new Date(item.originalDate);
      const targetDate = new Date(date);
      return (
        itemDate.getFullYear() !== targetDate.getFullYear() ||
        itemDate.getMonth() !== targetDate.getMonth() ||
        itemDate.getDate() !== targetDate.getDate()
      );
    },
    drop: (item) => {
      onTaskDrop(item.taskId, date);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [date, onTaskDrop]);

  return (
    <div
      ref={drop}
      className={`
        h-32 p-2 relative
        ${isToday ? 'bg-indigo-50' : isWeekend ? 'bg-gray-50/50' : ''}
        ${isOver && canDrop ? 'bg-indigo-100 ring-2 ring-indigo-400 ring-inset' : ''}
        ${isOver && !canDrop ? 'bg-red-50 ring-2 ring-red-400 ring-inset' : ''}
        transition-all duration-200
      `}
    >
      {isOver && (
        <div className={`
          absolute inset-0 flex items-center justify-center
          bg-${canDrop ? 'indigo' : 'red'}-100/50 backdrop-blur-sm
          transition-opacity duration-200
          ${isOver ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className={`
            text-sm font-medium
            text-${canDrop ? 'indigo' : 'red'}-600
          `}>
            {canDrop ? 'ドロップしてタスクを移動' : '同じ日時には移動できません'}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

function Calendar({ tasks, setTasks, onUpdateTask, onDeleteTask }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', または 'day'
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all',
    category: 'all',
    status: 'all'
  });
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentWeek = getWeekNumber(currentDate);

  // 週番号を取得する関数
  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // 週の日付範囲を取得する関数
  function getWeekDays(date) {
    const day = date.getDay();
    const diff = date.getDate() - day;
    const weekStart = new Date(date);
    weekStart.setDate(diff);
    
    const days = [];
    for(let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  // 月の日付配列を作成
  function getMonthDays() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDay = firstDay.getDay();
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    return Array.from({ length: 42 }, (_, i) => {
      const dayNumber = i - startingDay + 1;
      if (dayNumber < 1 || dayNumber > totalDays) return null;
      return new Date(currentYear, currentMonth, dayNumber);
    });
  }

  // 日付を変更する関数を改善
  const changeDate = (offset) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + offset);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (offset * 7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + offset);
        break;
    }
    setCurrentDate(newDate);
  };

  // 今日に戻る関数
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // フィルターの適用
  const applyFilters = (tasksToFilter) => {
    return tasksToFilter.filter(task => {
      const priorityMatch = filters.priority === 'all' || task.priority === filters.priority;
      const categoryMatch = filters.category === 'all' || task.category === filters.category;
      const statusMatch = filters.status === 'all' || 
        (filters.status === 'completed' ? task.completed : !task.completed);
      
      return priorityMatch && categoryMatch && statusMatch;
    });
  };

  // フィルターの変更を処理
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // カテゴリー一覧を取得
  const getUniqueCategories = () => {
    const categories = new Set(tasks.map(task => task.category).filter(Boolean));
    return Array.from(categories);
  };

  // 特定の日付のタスクを取得（フィルター適用）
  const getTasksForDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const tasksForDate = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      );
    });
    return applyFilters(tasksForDate);
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
    try {
      if (onUpdateTask) {
        const result = await onUpdateTask(updatedTask);
        // APIからの応答を使用してタスクを更新
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === updatedTask._id ? result : t)
        );
        setSelectedTask(null);
      }
    } catch (error) {
      console.error('タスクの更新に失敗しました:', error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (onDeleteTask) {
      await onDeleteTask(taskId);
    }
    setSelectedTask(null);
  };

  // タスクのドロップを処理する関数を改善
  const handleTaskDrop = async (taskId, date) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    // 新しい日付を設定する際、時間情報を保持
    const updatedDate = new Date(date);
    const originalDate = new Date(task.dueDate);
    updatedDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);

    const updatedTask = {
      ...task,
      dueDate: updatedDate.toISOString()
    };

    try {
      if (onUpdateTask) {
        const result = await onUpdateTask(updatedTask);
        // APIからの応答を使用してタスクを更新
        setTasks(prevTasks => 
          prevTasks.map(t => t._id === taskId ? result : t)
        );

        // 成功時のビジュアルフィードバック
        const element = document.querySelector(`[data-task-id="${taskId}"]`);
        if (element) {
          element.classList.add('scale-105', 'bg-green-50');
          setTimeout(() => {
            element.classList.remove('scale-105', 'bg-green-50');
          }, 300);
        }
      }
    } catch (error) {
      console.error('タスクの更新に失敗しました:', error);
      // エラー時のビジュアルフィードバック
      const element = document.querySelector(`[data-task-id="${taskId}"]`);
      if (element) {
        element.classList.add('scale-95', 'bg-red-50');
        setTimeout(() => {
          element.classList.remove('scale-95', 'bg-red-50');
        }, 300);
      }
    }
  };

  // 日付セルのレンダリング
  const DateCell = ({ date, isToday, isWeekend }) => {
    if (!date) return <div className="h-32 bg-gray-50" />;

    const tasksForDay = getTasksForDate(date.getDate());
    const maxVisibleTasks = 3;
    const hasMoreTasks = tasksForDay.length > maxVisibleTasks;
    const visibleTasks = tasksForDay.slice(0, maxVisibleTasks);

    return (
      <DroppableDateCell
        date={date}
        isToday={isToday}
        isWeekend={isWeekend}
        tasks={tasksForDay}
        onTaskDrop={handleTaskDrop}
      >
        <div className={`text-sm font-medium mb-1 ${
          isToday ? 'text-indigo-600' :
          date.getDay() === 0 ? 'text-red-500' :
          date.getDay() === 6 ? 'text-blue-500' :
          'text-gray-900'
        }`}>
          {viewMode === 'week' && (
            <div className="text-xs text-gray-500 mb-0.5">
              {date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
            </div>
          )}
          {date.getDate()}
        </div>
        <div className="space-y-1">
          {visibleTasks.map(task => (
            <DraggableTaskCard
              key={task._id}
              task={task}
              onTaskClick={handleTaskClick}
              onToggle={toggleTask}
            />
          ))}
          {hasMoreTasks && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <MoreHorizontal className="w-3 h-3" />
              <span>他{tasksForDay.length - maxVisibleTasks}件</span>
            </div>
          )}
        </div>
      </DroppableDateCell>
    );
  };

  // 日表示用の時間スロットを生成
  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(new Date(currentDate.setHours(hour, 0, 0, 0)));
    }
    return slots;
  };

  // 特定の時間のタスクを取得
  const getTasksForTimeSlot = (date) => {
    return applyFilters(tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate() &&
        taskDate.getHours() === date.getHours()
      );
    }));
  };

  // 日表示のレンダリング
  const DayView = () => {
    const timeSlots = getTimeSlots();
    const isToday = currentDate.toDateString() === new Date().toDateString();

    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 日付ヘッダー */}
        <div className="border-b border-gray-200 bg-gray-50 p-3">
          <div className={`text-center font-medium ${
            isToday ? 'text-indigo-600' :
            currentDate.getDay() === 0 ? 'text-red-500' :
            currentDate.getDay() === 6 ? 'text-blue-500' :
            'text-gray-900'
          }`}>
            {currentDate.toLocaleDateString('ja-JP', { 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-[80px,1fr] divide-x divide-gray-200 relative">
            {/* 時間列 */}
            <div className="divide-y divide-gray-200 sticky left-0 bg-white">
              {timeSlots.map((slot, index) => (
                <div key={index} className={`${TIME_SLOT_HEIGHT} flex items-center justify-center text-sm text-gray-500`}>
                  {slot.getHours().toString().padStart(2, '0')}:00
                </div>
              ))}
            </div>

            {/* タスク列 */}
            <div className="divide-y divide-gray-200">
              {timeSlots.map((slot, index) => {
                const tasksForSlot = getTasksForTimeSlot(slot);
                return (
                  <DroppableDateCell
                    key={index}
                    date={slot}
                    isToday={isToday}
                    tasks={tasksForSlot}
                    onTaskDrop={handleTaskDrop}
                  >
                    <div className="h-16 p-1">
                      {tasksForSlot.map(task => (
                        <DraggableTaskCard
                          key={task._id}
                          task={task}
                          onTaskClick={handleTaskClick}
                          onToggle={toggleTask}
                        />
                      ))}
                    </div>
                  </DroppableDateCell>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 週表示を改善
  const WeekView = () => {
    const days = getWeekDays(currentDate);
    
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="py-2 text-center text-sm font-medium text-gray-500">
            時間
          </div>
          {days.map((date, index) => (
            <div
              key={index}
              className={`py-2 text-center text-sm font-medium ${
                date.getDay() === 0 ? 'text-red-500' :
                date.getDay() === 6 ? 'text-blue-500' :
                'text-gray-500'
              }`}
            >
              <div>{['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}</div>
              <div className="text-xs mt-1">
                {date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
              </div>
            </div>
          ))}
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="max-h-[600px] overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {Array.from({ length: 24 }, (_, hour) => (
              <div key={hour} className="grid grid-cols-8 divide-x divide-gray-200">
                <div className="p-2 text-xs text-gray-500 sticky left-0 bg-white flex items-center justify-center h-16">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {days.map((date, index) => {
                  const slotDate = new Date(date);
                  slotDate.setHours(hour, 0, 0, 0);
                  const tasksForSlot = getTasksForTimeSlot(slotDate);
                  
                  return (
                    <DroppableDateCell
                      key={index}
                      date={slotDate}
                      isToday={date.toDateString() === new Date().toDateString()}
                      isWeekend={date.getDay() === 0 || date.getDay() === 6}
                      tasks={tasksForSlot}
                      onTaskDrop={handleTaskDrop}
                    >
                      <div className="h-16 p-1">
                        {tasksForSlot.map(task => (
                          <DraggableTaskCard
                            key={task._id}
                            task={task}
                            onTaskClick={handleTaskClick}
                            onToggle={toggleTask}
                          />
                        ))}
                      </div>
                    </DroppableDateCell>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // フィルターパネルのレンダリング
  const FilterPanel = () => {
    const categories = getUniqueCategories();
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">フィルター</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 優先度フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              優先度
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full rounded-lg border-gray-200 text-sm"
            >
              <option value="all">すべて</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>
          </div>

          {/* カテゴリーフィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              カテゴリー
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full rounded-lg border-gray-200 text-sm"
            >
              <option value="all">すべて</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* 状態フィルター */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状態
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full rounded-lg border-gray-200 text-sm"
            >
              <option value="all">すべて</option>
              <option value="completed">完了</option>
              <option value="incomplete">未完了</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {viewMode === 'month' 
                ? new Date(currentYear, currentMonth).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' })
                : viewMode === 'week'
                ? `${currentYear}年 第${currentWeek}週`
                : currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
              }
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeDate(-1)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="前へ"
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
                onClick={() => changeDate(1)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="次へ"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showFilters
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="フィルター"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'month'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="月表示"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'week'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="週表示"
            >
              <Rows className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                viewMode === 'day'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="日表示"
            >
              <CalendarViewIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* フィルターパネル */}
        {showFilters && <FilterPanel />}

        {/* カレンダー表示 */}
        {viewMode === 'month' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* 既存の月表示コード */}
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
            <div className="grid grid-cols-7 divide-x divide-y">
              {getMonthDays().map((date, index) => (
                <DateCell
                  key={index}
                  date={date}
                  isToday={date && date.toDateString() === new Date().toDateString()}
                  isWeekend={date && (date.getDay() === 0 || date.getDay() === 6)}
                />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'week' && <WeekView />}
        {viewMode === 'day' && <DayView />}

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
    </DndProvider>
  );
}

export default Calendar; 