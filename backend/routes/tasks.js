const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Comment = require('../models/comment');
const auth = require('../middleware/auth');

// 認証ミドルウェアを全てのルートに適用
router.use(auth);

// タスク一覧の取得
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// タスクの追加
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user._id
    });
    const validationError = task.validateSync();
    
    if (validationError) {
      return res.status(400).json({
        message: 'バリデーションエラー',
        errors: Object.values(validationError.errors).map(err => err.message)
      });
    }

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'バリデーションエラー',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: error.message });
  }
});

// タスクの更新
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
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

// タスクの削除
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }
    // 関連するコメントも削除
    await Comment.deleteMany({ task: req.params.id });
    res.json({ message: 'タスクを削除しました' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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