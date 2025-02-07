import { useState } from 'react';

import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, LogIn } from 'lucide-react';

export const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login({ email, password });
      if (success) {
        setEmail('');
        setPassword('');
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">MiniTask</h1>
        <p className="text-gray-600">生産性を最大限に引き出すタスク管理ツール</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm shadow-glass rounded-2xl px-8 pt-8 pb-8 mb-4 transition-all duration-300 hover:shadow-glass-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            メールアドレス
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10 w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="example@example.com"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-700 text-sm font-bold" htmlFor="password">
              パスワード
            </label>
            <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200">
              パスワードをお忘れですか？
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10 w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            アカウントをお持ちでない方は{' '}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
              新規登録
            </Link>
          </p>
        </div>
      </form>

    </div>
  );
}; 
