const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 認証ミドルウェア
const protect = async (req, res, next) => {
  try {
    let token;

    // トークンの取得方法を制限
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証が必要です'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'このトークンのユーザーは存在しません'
        });
      }

      // パスワード変更後のトークンを無効化
      if (user.passwordChangedAt) {
        const changedTimestamp = parseInt(
          user.passwordChangedAt.getTime() / 1000,
          10
        );
        if (decoded.iat < changedTimestamp) {
          return res.status(401).json({
            success: false,
            message: 'パスワードが変更されました。再度ログインしてください'
          });
        }
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '無効なトークンです'
      });
    }
  } catch (error) {
    next(error);
  }
};

// 特定のロールのみアクセス可能
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'このリソースへのアクセス権限がありません'
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
}; 