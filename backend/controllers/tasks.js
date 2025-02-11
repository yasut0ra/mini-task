const Task = require('../models/task');
const User = require('../models/user');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// ステータス更新のポイント定義
const STATUS_POINTS = {
  intelligence: 10,
  emotional: 10,
  health: 10,
  social: 10,
  wealth: 10
};

// タスク一覧の取得
exports.getTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json({ success: true, data: tasks });
});

// タスクの作成
exports.createTask = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const task = await Task.create(req.body);
  res.status(201).json({ success: true, data: task });
});

// タスクの更新
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`ID: ${req.params.id} のタスクは存在しません`, 404));
  }

  // タスクの所有者確認
  if (task.user.toString() !== req.user.id) {
    return next(new ErrorResponse('このタスクを更新する権限がありません', 401));
  }

  const wasCompleted = task.completed;
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // タスクが完了状態に変更された場合、ユーザーのステータスを更新
  if (!wasCompleted && task.completed) {
    const user = await User.findById(req.user.id);
    user.status[task.category] += STATUS_POINTS[task.category];
    await user.save();
  }

  res.status(200).json({ success: true, data: task });
});

// タスクの削除
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse(`ID: ${req.params.id} のタスクは存在しません`, 404));
  }

  // タスクの所有者確認
  if (task.user.toString() !== req.user.id) {
    return next(new ErrorResponse('このタスクを削除する権限がありません', 401));
  }

  await task.remove();

  res.status(200).json({ success: true, data: {} });
});

// ユーザーのステータス取得
exports.getUserStatus = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user.status });
}); 