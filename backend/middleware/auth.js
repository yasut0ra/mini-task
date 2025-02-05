const { verifyToken } = require('../utils/jwt');
const User = require('../models/user');

// 認証ミドルウェア
const protect = async (req, res, next) => {
  try {
    let token;

    // トークンの取得（Authorization headerまたはcookie）
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Bearer tokenから取得
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      // Cookieから取得
      token = req.cookies.token;
    }

    // トークンが存在しない場合
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証が必要です'
      });
    }

    try {
      // トークンの検証
      const decoded = verifyToken(token);

      // ユーザーの取得
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'ユーザーが見つかりません'
        });
      }

      // リクエストオブジェクトにユーザー情報を追加
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '無効なトークンです'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました'
    });
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