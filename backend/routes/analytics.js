const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const { protect } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// テスト用エンドポイント
router.get('/test', (req, res) => {
  res.json({ message: 'Analytics route is working' });
});

// タスクの統計情報を取得
router.get('/stats', protect, catchAsync(async (req, res) => {
  const stats = await Task.aggregate([
    {
      $match: {
        user: req.user._id
      }
    },
    {
      $group: {
        _id: null,
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: { $cond: ['$completed', 1, 0] }
        },
        incompleteTasks: {
          $sum: { $cond: ['$completed', 0, 1] }
        }
      }
    }
  ]);

  res.json(stats[0] || {
    totalTasks: 0,
    completedTasks: 0,
    incompleteTasks: 0
  });
}));

module.exports = router; 