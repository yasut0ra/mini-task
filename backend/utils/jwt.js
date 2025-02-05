const jwt = require('jsonwebtoken');
const Token = require('../models/token');

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

// リフレッシュトークンの生成
const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '30d' }
  );

  // リフレッシュトークンをDBに保存
  await Token.create({
    user: userId,
    token: refreshToken,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30日
  });

  return refreshToken;
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

// レスポンスにトークンを設定（更新）
const sendTokenResponse = async (user, statusCode, res) => {
  // アクセストークンの生成
  const token = generateToken(user._id);
  
  // リフレッシュトークンの生成
  const refreshToken = await generateRefreshToken(user._id);

  // クッキーにトークンを設定
  res.cookie('token', token, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

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
  generateRefreshToken,
  verifyToken,
  sendTokenResponse,
  cookieOptions
}; 