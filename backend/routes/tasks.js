const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const taskController = require('../controllers/taskController');
const Task = require('../models/task');
const Comment = require('../models/comment');

// 認証ミドルウェアを全てのルートに適用
router.use(auth);

// タスク一覧の取得
router.get('/', taskController.getTasks);

// タスクの追加
router.post('/', taskController.createTask);

// タスクの更新
router.put('/:id', taskController.updateTask);

// タスクの完了状態の切り替え
router.patch('/:id/toggle', taskController.toggleTaskCompletion);

// タスクの削除
router.delete('/:id', taskController.deleteTask);

// 開発環境でのみ利用可能なエンドポイント
if (process.env.NODE_ENV === 'development') {
  router.delete('/all', async (req, res) => {
    try {
      await Task.deleteMany({ user: req.user._id });
      await Comment.deleteMany({ task: { $in: await Task.find({ user: req.user._id }).distinct('_id') } });
      res.json({ message: 'すべてのタスクとコメントを削除しました' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}

module.exports = router;