const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// テスト用エンドポイント
router.get('/test', (req, res) => {
  res.json({ message: 'Analytics route is working' });
});

// タスクの統計情報を取得
router.get('/stats', async (req, res) => {
  try {
    // 全体の統計
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // 優先度別の統計
    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          }
        }
      }
    ]);

    // カテゴリー別の統計
    const categoryStats = await Task.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$category', '未分類'] },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          }
        }
      }
    ]);

    // 期限切れタスクの数
    const overdueTasks = await Task.countDocuments({
      completed: false,
      dueDate: { $lt: new Date() }
    });

    res.json({
      overview: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: completionRate.toFixed(1),
        overdue: overdueTasks
      },
      byPriority: priorityStats,
      byCategory: categoryStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 