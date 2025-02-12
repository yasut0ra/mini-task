const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  statusPoints: {
    intelligence: { type: Number, default: 0 },
    emotional: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    wealth: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// パスワードのハッシュ化
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// パスワード検証メソッド
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ステータスポイント加算メソッド
userSchema.methods.addStatusPoints = async function(category, points) {
  this.statusPoints[category] += points;
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User; 