const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'タイトルは必須です'],
    trim: true,
    maxlength: [100, 'タイトルは100文字以内で入力してください']
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || !isNaN(new Date(v).getTime());
      },
      message: '有効な日付を入力してください'
    }
  },
  dueTime: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: '有効な時間を入力してください（HH:MM形式）'
    }
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: '優先度は low, medium, high のいずれかを選択してください'
    },
    default: 'medium'
  },
  category: {
    type: String,
    enum: {
      values: ['intelligence', 'emotional', 'health', 'social', 'wealth'],
      message: 'カテゴリーは intelligence, emotional, health, social, wealth のいずれかを選択してください'
    },
    required: [true, 'カテゴリーは必須です']
  },
  statusPoints: {
    intelligence: { type: Number, default: 1 },
    emotional: { type: Number, default: 1 },
    health: { type: Number, default: 1 },
    social: { type: Number, default: 1 },
    wealth: { type: Number, default: 1 }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'ユーザーIDは必須です']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// カスタムバリデーション
taskSchema.pre('save', function(next) {
  if (this.dueDate && this.dueDate < new Date()) {
    next(new Error('期限を過去の日付に設定することはできません'));
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema); 