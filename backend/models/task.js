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
    trim: true,
    maxlength: [20, 'カテゴリーは20文字以内で入力してください']
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