const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/error');
const securityMiddleware = require('./middleware/security');

const app = express();

// APIルートのプレフィックスを追加
app.use('/api', express.Router());

// セキュリティミドルウェアの適用
securityMiddleware(app);

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com'
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600 // 10分
};

app.use(cors(corsOptions));
app.use(express.json());

// デバッグ用のミドルウェア
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ルートの設定
app.use('/tasks', taskRoutes);
app.use('/comments', commentRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/users', userRoutes);

// 404エラーハンドリング
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'リクエストされたリソースが見つかりません'
  });
});

// グローバルエラーハンドラー
app.use(errorHandler);

module.exports = app; 