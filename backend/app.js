const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();

// CORS設定
const corsOptions = {
  origin: function (origin, callback) {
    // 許可するオリジンのリスト
    const allowedOrigins = [
      'http://localhost:5173',           // 開発環境
      'http://localhost:3000',           // 開発環境の代替ポート
      'https://mini-task-puce.vercel.app', // Vercel本番環境
      /^https:\/\/mini-task-.*\.vercel\.app$/ // Vercelプレビュー環境
    ];

    // オリジンがnull（同一オリジン）の場合や、許可リストに含まれる場合は許可
    if (!origin || allowedOrigins.some(allowed => 
      typeof allowed === 'string' 
        ? allowed === origin 
        : allowed.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// デバッグ用のミドルウェア
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  next();
});

// MongoDBの接続状態を確認するミドルウェア
app.use(async (req, res, next) => {
  try {
    if (!mongoose.connection.readyState) {
      console.error('No MongoDB connection available');
      return res.status(500).json({ 
        message: 'データベース接続が確立されていません',
        error: process.env.NODE_ENV === 'development' ? 'No database connection' : undefined
      });
    }
    next();
  } catch (error) {
    console.error('Database middleware error:', error);
    next(error);
  }
});

// APIルートの設定（先にAPI routesを設定）
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);

// 本番環境でのフロントエンドの静的ファイル配信
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  // この行を削除または修正（APIルートと競合する可能性があるため）
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  // });
}

// 404エラーハンドリング
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    const error = new Error('API endpoint not found');
    error.status = 404;
    next(error);
  } else if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  } else {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
  }
});

// グローバルエラーハンドリング
app.use((err, req, res, next) => {
  console.error('Application error:', {
    message: err.message,
    stack: err.stack,
    status: err.status || 500,
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers
  });

  // MongoDBエラーの処理
  if (err.name === 'MongoError' || err.name === 'MongoServerError') {
    return res.status(500).json({
      message: 'データベースエラーが発生しました',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // バリデーションエラーの処理
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'バリデーションエラー',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // その他のエラー
  res.status(err.status || 500).json({
    message: err.message || 'サーバーエラーが発生しました',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app; 