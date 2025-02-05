const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const Comment = require('../models/comment');
const { protect } = require('../middleware/auth');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// タスク一覧の取得
router.get('/', protect, catchAsync(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json(tasks);
}));

// タスクの追加
router.post('/', protect, catchAsync(async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.user.id
  });
  
  const validationError = task.validateSync();
  
  if (validationError) {
    throw new AppError(
      Object.values(validationError.errors)
        .map(err => err.message)
        .join(', '),
      400
    );
  }

  const newTask = await task.save();
  res.status(201).json(newTask);
}));

// タスクの更新
router.put('/:id', protect, catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!task) {
    throw new AppError('タスクが見つかりません', 404);
  }

  Object.assign(task, req.body);
  const updatedTask = await task.save();
  res.json(updatedTask);
}));

// タスクの部分更新（完了状態の切り替えなど）
router.patch('/:id', protect, catchAsync(async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    user: req.user.id
  });

  if (!task) {
    throw new AppError('タスクが見つかりません', 404);
  }

  Object.assign(task, req.body);
  const updatedTask = await task.save();
  res.json(updatedTask);
}));

// タスクの削除
router.delete('/:id', protect, catchAsync(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id
  });

  if (!task) {
    throw new AppError('タスクが見つかりません', 404);
  }

  res.json({ message: 'タスクを削除しました' });
}));

// 開発環境でのみ利用可能なエンドポイント
if (process.env.NODE_ENV === 'development') {
  router.delete('/all', catchAsync(async (req, res) => {
    await Task.deleteMany({});
    await Comment.deleteMany({});
    res.json({ message: 'すべてのタスクとコメントを削除しました' });
  }));
}

module.exports = router;
