const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'ユーザー名は必須です'],
    unique: true,
    trim: true,
    minlength: [3, 'ユーザー名は3文字以上で入力してください'],
    maxlength: [20, 'ユーザー名は20文字以内で入力してください']
  },
  email: {
    type: String,
    required: [true, 'メールアドレスは必須です'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '有効なメールアドレスを入力してください']
  },
  password: {
    type: String,
    required: [true, 'パスワードは必須です'],
    minlength: [6, 'パスワードは6文字以上で入力してください'],
    select: false
  },
  status: {
    intelligence: { type: Number, default: 0 },
    emotional: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    wealth: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// パスワードのハッシュ化
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// パスワードの照合
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 