const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// レート制限の設定
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // IPごとに100リクエストまで
  message: {
    success: false,
    message: 'リクエスト数が制限を超えました。しばらく待ってから再試行してください。'
  }
});

// セキュリティミドルウェアの設定
const securityMiddleware = (app) => {
  // セキュリティヘッダーの設定
  app.use(helmet());

  // レート制限の適用
  app.use('/api', limiter);

  // NoSQLインジェクション対策
  app.use(mongoSanitize());

  // XSS対策
  app.use(xss());

  // HTTPパラメータ汚染対策
  app.use(hpp());

  // ボディサイズの制限
  app.use(express.json({ limit: '10kb' }));
};

module.exports = securityMiddleware; 