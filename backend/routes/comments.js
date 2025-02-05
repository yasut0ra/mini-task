const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Task = require('../models/task');

// タスクのコメント一覧を取得
router.get('/task/:taskId', async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// コメントを追加
router.post('/', async (req, res) => {
  try {
    const task = await Task.findById(req.body.taskId);
    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }

    const comment = new Comment({
      taskId: req.body.taskId,
      text: req.body.text
    });

    const newComment = await comment.save();
    res.status(201).json(newComment);
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

// コメントを更新
router.put('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'コメントが見つかりません' });
    }

    comment.text = req.body.text;
    const updatedComment = await comment.save();
    res.json(updatedComment);
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

// コメントを削除
router.delete('/:id', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'コメントが見つかりません' });
    }
    res.json({ message: 'コメントを削除しました' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 