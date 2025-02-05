const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');

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
  lastLogin: {
    type: Date,
    default: null
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

const User = mongoose.model('User', userSchema);

module.exports = User; 