import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value

    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      if (success) {
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">MiniTask</h1>
        <p className="text-gray-600">タスク管理の新しいスタートを始めましょう</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm shadow-glass rounded-2xl px-8 pt-8 pb-8 mb-4 transition-all duration-300 hover:shadow-glass-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">アカウント登録</h2>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            お名前
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input pl-10 w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="山田 太郎"
              required
            />
          </div>
        </div>

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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input pl-10 w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="example@example.com"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            パスワード
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="input pl-10 w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">6文字以上の英数字を入力してください</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            パスワード（確認）
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input pl-10 w-full focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {isLoading ? '登録中...' : 'アカウントを作成'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            すでにアカウントをお持ちの方は{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
              ログイン
            </Link>
          </p>
        </div>
      </form>

      <div className="text-center text-sm text-gray-600">
        <p>アカウント登録により、以下に同意したことになります：</p>
        <div className="mt-2 space-y-2">
          <Link to="/terms" className="text-indigo-600 hover:text-indigo-800 block">
            利用規約
          </Link>
          <Link to="/privacy" className="text-indigo-600 hover:text-indigo-800 block">
            プライバシーポリシー
          </Link>
        </div>
      </div>
    </div>
  );
}; 

