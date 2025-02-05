const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect } = require('../middleware/auth');
const { sendTokenResponse, generateToken, cookieOptions } = require('../utils/jwt');
const Token = require('../models/token');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// ユーザー登録
router.post('/register', catchAsync(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // メールアドレスの重複チェック
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('このメールアドレスは既に登録されています', 400);
    }

    // ユーザーの作成
    const user = await User.create({
      name,
      email,
      password
    });

    // トークンの生成と送信
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}));

// ログイン
router.post('/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;

  // メールアドレスとパスワードのチェック
  if (!email || !password) {
    throw new AppError('メールアドレスとパスワードを入力してください', 400);
  }

  // ユーザーの取得（パスワードを含める）
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('メールアドレスまたはパスワードが正しくありません', 401);
  }

  // パスワードの照合
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('メールアドレスまたはパスワードが正しくありません', 401);
  }

  // 最終ログイン日時の更新
  user.lastLogin = Date.now();
  await user.save();

  // トークンの生成と送信
  sendTokenResponse(user, 200, res);
}));

// ログアウト
router.get('/logout', catchAsync(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  // リフレッシュトークンをDBから削除
  if (req.cookies.refreshToken) {
    await Token.deleteOne({ token: req.cookies.refreshToken });
  }

  res.status(200).json({
    success: true,
    message: 'ログアウトしました'
  });
}));

// 現在のユーザー情報の取得
router.get('/me', protect, catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('ユーザーが見つかりません', 404);
  }

  res.status(200).json({
    success: true,
    data: user
  });
}));

// トークンのリフレッシュ
router.post('/refresh', catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError('リフレッシュトークンが見つかりません', 401);
  }

  // DBからリフレッシュトークンを検索
  const savedToken = await Token.findOne({ token: refreshToken });
  if (!savedToken) {
    throw new AppError('無効なリフレッシュトークンです', 401);
  }

  // トークンの有効期限をチェック
  if (savedToken.expires < new Date()) {
    await savedToken.remove();
    throw new AppError('リフレッシュトークンの期限が切れています', 401);
  }

  // 新しいアクセストークンを生成
  const user = await User.findById(savedToken.user);
  if (!user) {
    throw new AppError('ユーザーが見つかりません', 401);
  }

  const token = generateToken(user._id);
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    success: true,
    token
  });
}));

// パスワードリセットメールの送信
router.post('/forgot-password', catchAsync(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new AppError('このメールアドレスは登録されていません', 404);
  }

  // リセットトークンの生成
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // リセットURLの生成
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // メール本文の作成
  const html = `
    <h1>パスワードリセットのご案内</h1>
    <p>以下のリンクをクリックしてパスワードをリセットしてください：</p>
    <a href="${resetUrl}">パスワードをリセット</a>
    <p>このリンクは1時間後に無効となります。</p>
    <p>このメールに心当たりがない場合は、無視してください。</p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'パスワードリセットのご案内',
    html
  });

  res.status(200).json({
    success: true,
    message: 'パスワードリセット用のメールを送信しました'
  });
}));

// パスワードのリセット
router.put('/reset-password/:resetToken', catchAsync(async (req, res) => {
  // トークンをハッシュ化
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // トークンと有効期限で検索
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    throw new AppError('パスワードリセットトークンが無効または期限切れです', 400);
  }

  // 新しいパスワードを設定
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'パスワードを更新しました'
  });
}));

module.exports = router; 