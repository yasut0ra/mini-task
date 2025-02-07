const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const commentRoutes = require('./routes/comments');
const analyticsRoutes = require('./routes/analytics');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// デバッグ用のミドルウェア
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ルートの設定
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/comments', commentRoutes);
app.use('/analytics', analyticsRoutes);

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'サーバーエラーが発生しました' });
});

module.exports = app; 