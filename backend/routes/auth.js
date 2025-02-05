const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { protect } = require('../middleware/auth');
const { sendTokenResponse, generateToken, cookieOptions } = require('../utils/jwt');
const Token = require('../models/token');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// ユーザー登録
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // メールアドレスの重複チェック
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'このメールアドレスは既に登録されています'
      });
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
});

// ログイン
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // メールアドレスとパスワードのチェック
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'メールアドレスとパスワードを入力してください'
      });
    }

    // ユーザーの取得（パスワードを含める）
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }

    // パスワードの照合
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'メールアドレスまたはパスワードが正しくありません'
      });
    }

    // 最終ログイン日時の更新
    user.lastLogin = Date.now();
    await user.save();

    // トークンの生成と送信
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ログアウト
router.get('/logout', (req, res) => {
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
});

// 現在のユーザー情報の取得
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// トークンのリフレッシュ
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'リフレッシュトークンが見つかりません'
      });
    }

    // DBからリフレッシュトークンを検索
    const savedToken = await Token.findOne({ token: refreshToken });
    if (!savedToken) {
      return res.status(401).json({
        success: false,
        message: '無効なリフレッシュトークンです'
      });
    }

    // トークンの有効期限をチェック
    if (savedToken.expires < new Date()) {
      await savedToken.remove();
      return res.status(401).json({
        success: false,
        message: 'リフレッシュトークンの期限が切れています'
      });
    }

    // 新しいアクセストークンを生成
    const user = await User.findById(savedToken.user);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ユーザーが見つかりません'
      });
    }

    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// パスワードリセットメールの送信
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'このメールアドレスは登録されていません'
      });
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
  } catch (error) {
    // エラーが発生した場合はトークンをクリア
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      success: false,
      message: 'メールの送信に失敗しました'
    });
  }
});

// パスワードのリセット
router.put('/reset-password/:resetToken', async (req, res) => {
  try {
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
      return res.status(400).json({
        success: false,
        message: 'パスワードリセットトークンが無効または期限切れです'
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router; 