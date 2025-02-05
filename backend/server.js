const app = require('./app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
const taskRoutes = require('./routes/tasks');
const cookieParser = require('cookie-parser');

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// すべてのリクエストから先頭の "/api" を削除するミドルウェア
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace(/^\/api/, '');
  }
  next();
});

// MongoDBの接続（環境変数が設定されていればそちらを使用）
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/minitask', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use('/tasks', taskRoutes);
app.use('/auth', require('./routes/auth'));

// Vercel では serverless-http を利用してエクスポート
const serverless = require('serverless-http');
module.exports = serverless(app);
