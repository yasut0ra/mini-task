import { useState, useEffect } from 'react';
import { 
  ListTodo,
  Calendar as CalendarIcon,
  BarChart2,
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';
import { taskApi } from './services/api';
import TaskList from './components/TaskList';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import Settings from './components/Settings';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // タスク一覧の取得
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskApi.fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // タスクの追加
  const addTask = async (taskData) => {
    setIsLoading(true);
    try {
      const newTask = await taskApi.createTask(taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // タスクの削除
  const deleteTask = async (id) => {
    setIsLoading(true);
    try {
      await taskApi.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // タスクの完了状態の切り替え
  const toggleTask = async (id) => {
    setIsLoading(true);
    try {
      const task = tasks.find(t => t._id === id);
      const updatedTask = await taskApi.toggleTaskStatus(id, !task.completed);
      setTasks(prevTasks =>
        prevTasks.map(t => t._id === id ? updatedTask : t)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // タスクの更新
  const updateTask = async (updatedTask) => {
    setIsLoading(true);
    try {
      const updated = await taskApi.updateTask(updatedTask._id, updatedTask);
      setTasks(prevTasks =>
        prevTasks.map(task => task._id === updatedTask._id ? updated : task)
      );
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigation = [
    { name: 'タスク', icon: ListTodo, view: 'tasks' },
    { name: '分析', icon: BarChart2, view: 'analytics' },
    { name: 'カレンダー', icon: CalendarIcon, view: 'calendar' },
    { name: '設定', icon: SettingsIcon, view: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <p>{error}</p>
        </div>
      )}

      {/* モバイルメニューボタン */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 p-2 rounded-xl bg-white shadow-lg lg:hidden z-50"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <div className="lg:flex">
        {/* サイドバー */}
        <aside className={`
          fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">MiniTask</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setCurrentView(item.view);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200
                    ${currentView === item.view
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 pt-24 lg:pt-0">
          <div className="max-w-5xl mx-auto px-4 py-8">
            {isLoading && (
              <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <p className="text-gray-600">読み込み中...</p>
                </div>
              </div>
            )}
            {currentView === 'tasks' && (
              <TaskList 
                tasks={tasks}
                onAddTask={addTask}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onUpdateTask={updateTask}
                isLoading={isLoading}
                isInitialLoading={isInitialLoading}
              />
            )}
            {currentView === 'analytics' && (
              <Analytics tasks={tasks} />
            )}
            {currentView === 'calendar' && (
              <Calendar 
                tasks={tasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
              />
            )}
            {currentView === 'settings' && (
              <Settings />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
