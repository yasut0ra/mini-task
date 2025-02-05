const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// プロフィールの更新
router.put('/profile', protect, catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new AppError('ユーザーが見つかりません', 404);
  }

  // メールアドレスの重複チェック
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('このメールアドレスは既に使用されています', 400);
    }
  }

  // プロフィールの更新
  user.name = name || user.name;
  user.email = email || user.email;
  await user.save();

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
}));

// パスワードの変更
router.put('/password', protect, catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  // 現在のパスワードを確認
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('現在のパスワードが正しくありません', 401);
  }

  // 新しいパスワードを設定
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'パスワードを更新しました'
  });
}));

module.exports = router; 