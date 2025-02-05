const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com'
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'サーバーエラーが発生しました' });
});

module.exports = app; 