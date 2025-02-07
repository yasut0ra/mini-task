import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ListTodo, 
  Calendar as CalendarIcon, 
  BarChart2, 
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      icon: ListTodo,
      title: 'シンプルなタスク管理',
      description: '直感的なインターフェースで、タスクの作成・編集・削除が簡単に行えます。'
    },
    {
      icon: CalendarIcon,
      title: 'カレンダー表示',
      description: '期限を設定したタスクをカレンダーで視覚的に管理できます。'
    },
    {
      icon: BarChart2,
      title: '進捗分析',
      description: 'タスクの完了率や傾向を分析し、生産性の向上をサポートします。'
    },
    {
      icon: MessageSquare,
      title: 'コメント機能',
      description: 'タスクごとにメモやコメントを残して、詳細な情報管理が可能です。'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* ヘッダー */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold gradient-text">MiniTask</h1>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="btn btn-secondary"
              >
                ログイン
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="pt-24">
        {/* ヒーローセクション */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              シンプルで使いやすい
              <br />
              <span className="gradient-text">タスク管理ツール</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              MiniTaskは、日々のタスクを効率的に管理し、
              <br />
              生産性を最大限に引き出すためのツールです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
              >
                今すぐ始める
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="btn btn-secondary text-lg px-8 py-4"
              >
                機能を見る
              </a>
            </div>
          </div>
        </section>

        {/* 機能紹介セクション */}
        <section id="features" className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              主な機能
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-glass hover:shadow-glass-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <feature.icon className="w-8 h-8 text-indigo-600" />
                    <h4 className="text-xl font-bold text-gray-900">{feature.title}</h4>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              さあ、始めましょう
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              MiniTaskで、タスク管理を効率化しませんか？
              <br />
              無料で始められます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                無料アカウントを作成
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-bold gradient-text mb-4">MiniTask</h4>
              <p className="text-gray-600">
                シンプルで使いやすいタスク管理ツール
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">リンク</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                    プライバシーポリシー
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-4">アカウント</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-600 hover:text-gray-900">
                    アカウント作成
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} MiniTask. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}; 