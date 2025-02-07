
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  ListTodo,
  Calendar as CalendarIcon,
  BarChart2,
  Settings as SettingsIcon,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { taskApi } from './services/api';
import TaskList from './components/TaskList';
import Analytics from './components/Analytics';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { LandingPage } from './components/LandingPage';
import { useStore } from './store/index.jsx';
import { useToast } from './contexts/ToastContext';
import { useAuth } from './contexts/AuthContext';
import { ErrorMessage } from './components/ui/ErrorMessage';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [currentView, setCurrentView] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { state: { error }, dispatch } = useStore();
  const { addToast } = useToast();
  const { user, logout } = useAuth();

  // タスク一覧の取得
  useEffect(() => {
    if (user) {
      const fetchTasks = async () => {
        try {
          const data = await taskApi.fetchTasks();
          setTasks(data);
          dispatch({ type: 'CLEAR_ERROR' });
        } catch (err) {
          dispatch({ type: 'SET_ERROR', payload: err.message });
        } finally {
          setIsInitialLoading(false);
        }
      };

      fetchTasks();
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
}

// 未認証ユーザー用のルート（ログイン済みの場合はダッシュボードへ）
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return user ? <Navigate to="/" /> : children;
}

  const AuthenticatedApp = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient">
      {error && <ErrorMessage message={error} />}

            {/* 未認証ユーザー用のルート */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />

      <div className="lg:grid lg:grid-cols-[280px,1fr] min-h-screen">
        {/* サイドバー */}
        <aside className={`
          fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                MiniTask
              </h1>
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
                    w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ease-in-out transform hover:scale-102 group
                    ${currentView === item.view
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-all duration-300 ${
                    currentView === item.view 
                      ? 'rotate-0' 
                      : 'rotate-0 group-hover:rotate-12'
                  }`} />
                  {item.name}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 ease-in-out text-red-600 hover:bg-red-50 group"
              >
                <LogOut className="w-5 h-5 transition-all duration-300 group-hover:rotate-12" />
                ログアウト
              </button>
            </nav>
          </div>
        </aside>


            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordForm />
                </PublicRoute>
              }
            />

            <Route
              path="/reset-password/:resetToken"
              element={
                <PublicRoute>
                  <ResetPasswordForm />
                </PublicRoute>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} />
        <Route
          path="/dashboard/*"
          element={user ? <AuthenticatedApp /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
