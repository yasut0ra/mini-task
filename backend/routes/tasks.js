const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Comment = require('../models/comment');
const { protect } = require('../middleware/auth');

// タスク一覧の取得
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// タスクの追加
router.post('/', protect, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.user.id
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
router.put('/:id', protect, async (req, res) => {
  try {
    // タスクの所有者チェック
    let task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'このタスクを編集する権限がありません' });
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
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
    const task = await Task.findByIdAndUpdate(
      req.params.id,
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
router.delete('/:id', protect, async (req, res) => {
  try {
    // タスクの所有者チェック
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'このタスクを削除する権限がありません' });
    }

    await task.remove();
    res.json({ message: 'タスクを削除しました' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 開発環境でのみ利用可能なエンドポイント
if (process.env.NODE_ENV === 'development') {
  router.delete('/all', async (req, res) => {
    try {
      await Task.deleteMany({});
      await Comment.deleteMany({});
      res.json({ message: 'すべてのタスクとコメントを削除しました' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
}

module.exports = router;
