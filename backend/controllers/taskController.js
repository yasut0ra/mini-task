const Task = require('../models/task');
const Comment = require('../models/comment');
const User = require('../models/user');

// タスク一覧の取得
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// タスクの追加
exports.createTask = async (req, res) => {
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
};

// タスクの更新
exports.updateTask = async (req, res) => {
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
};

// タスクの完了状態の切り替え
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }

    const wasCompleted = task.completed;
    task.completed = !wasCompleted;

    // タスクが完了状態になった場合のみポイントを加算
    if (!wasCompleted && task.completed) {
      const points = task.statusPoints[task.category];
      await req.user.addStatusPoints(task.category, points);
    }
    // タスクが未完了状態に戻された場合はポイントを減算
    else if (wasCompleted && !task.completed) {
      const points = task.statusPoints[task.category];
      await req.user.addStatusPoints(task.category, -points);
    }

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// タスクの削除
exports.deleteTask = async (req, res) => {
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
}; 