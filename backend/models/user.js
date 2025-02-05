const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '名前は必須です'],
    trim: true,
    minlength: [2, '名前は2文字以上である必要があります'],
    maxlength: [50, '名前は50文字以下である必要があります']
  },
  email: {
    type: String,
    required: [true, 'メールアドレスは必須です'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      '有効なメールアドレスを入力してください'
    ]
  },
  password: {
    type: String,
    required: [true, 'パスワードは必須です'],
    minlength: [8, 'パスワードは8文字以上である必要があります'],
    select: false // デフォルトでパスワードを取得しない
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  passwordChangedAt: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// パスワードの暗号化
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.passwordChangedAt = Date.now() - 1000; // 1秒前に設定
    next();
  } catch (error) {
    next(error);
  }
});

// パスワードの検証メソッド
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// JWTトークンの生成メソッド
userSchema.methods.generateAuthToken = function() {
  return generateToken(this._id);
};

// パスワードリセットトークンの生成
userSchema.methods.getResetPasswordToken = function() {
  // ランダムなトークンを生成
  const resetToken = crypto.randomBytes(20).toString('hex');

  // トークンをハッシュ化してDBに保存
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // トークンの有効期限を設定（1時間）
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 