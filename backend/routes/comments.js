const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Task = require('../models/task');
const { protect } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// タスクのコメント一覧を取得
router.get('/task/:taskId', protect, catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.taskId,
    user: req.user.id
  });

  if (!task) {
    throw new AppError('タスクが見つかりません', 404);
  }

  const comments = await Comment.find({ task: req.params.taskId })
    .sort('-createdAt');
  res.json(comments);
}));

// コメントを追加
router.post('/', protect, catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.body.taskId,
    user: req.user.id
  });

  if (!task) {
    throw new AppError('タスクが見つかりません', 404);
  }

  const comment = new Comment({
    text: req.body.text,
    task: req.body.taskId,
    user: req.user.id
  });

  const savedComment = await comment.save();
  res.status(201).json(savedComment);
}));

// コメントを更新
router.put('/:id', protect, catchAsync(async (req, res) => {
  const comment = await Comment.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!comment) {
    throw new AppError('コメントが見つかりません', 404);
  }

  comment.text = req.body.text;
  const updatedComment = await comment.save();
  res.json(updatedComment);
}));

// コメントを削除
router.delete('/:id', protect, catchAsync(async (req, res) => {
  const comment = await Comment.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!comment) {
    throw new AppError('コメントが見つかりません', 404);
  }

  res.json({ message: 'コメントを削除しました' });
}));

module.exports = router; 