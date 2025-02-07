const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

// テスト用エンドポイント
router.get('/test', auth, (req, res) => {
  res.json({ message: 'Analytics route is working' });
});

// タスクの統計情報を取得
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const userFilter = { user: userId };

    // 全体の統計
    const totalTasks = await Task.countDocuments(userFilter);
    const completedTasks = await Task.countDocuments({ ...userFilter, completed: true });
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // 優先度別の統計
    const priorityStats = await Task.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // カテゴリー別の統計
    const categoryStats = await Task.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: { $ifNull: ['$category', '未分類'] },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 期限切れタスクの数
    const overdueTasks = await Task.countDocuments({
      ...userFilter,
      completed: false,
      dueDate: { $lt: new Date() }
    });

    // 月別の統計
    const monthlyStats = await Task.aggregate([
      { $match: userFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.json({
      overview: {
        total: totalTasks,
        completed: completedTasks,
        completionRate: completionRate.toFixed(1),
        overdue: overdueTasks
      },
      byPriority: priorityStats,
      byCategory: categoryStats,
      monthly: monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 