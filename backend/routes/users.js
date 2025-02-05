const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// プロフィールの更新
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ユーザーが見つかりません'
      });
    }

    // メールアドレスの重複チェック
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'このメールアドレスは既に使用されています'
        });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// パスワードの変更
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // 現在のパスワードを確認
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '現在のパスワードが正しくありません'
      });
    }

    // 新しいパスワードを設定
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'パスワードを更新しました'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 