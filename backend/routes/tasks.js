const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Comment = require('../models/comment');
const { protect } = require('../middleware/auth');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getUserStatus
} = require('../controllers/tasks');

// 認証ミドルウェアを全てのルートに適用
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.get('/status', getUserStatus);

// タスクの部分更新（完了状態の切り替えなど）
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

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