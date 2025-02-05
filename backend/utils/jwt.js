const jwt = require('jsonwebtoken');

// JWTの設定
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE || 7;

// トークンの生成
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

// トークンの検証
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('無効なトークンです');
  }
};

// クッキーオプションの設定
const cookieOptions = {
  expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

// レスポンスにトークンを設定
const sendTokenResponse = (user, statusCode, res) => {
  // トークンの生成
  const token = generateToken(user._id);

  // クッキーにトークンを設定
  res.cookie('token', token, cookieOptions);

  // レスポンスを送信
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse,
  cookieOptions
}; 