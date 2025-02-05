const AppError = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // カスタムエラーの場合
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // MongoDBの重複キーエラー
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: '既に使用されている値です'
    });
  }

  // バリデーションエラー
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  // JWT関連のエラー
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: '無効なトークンです'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'トークンの有効期限が切れています'
    });
  }

  // その他のエラー
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'サーバーエラーが発生しました'
  });
};

module.exports = errorHandler; 