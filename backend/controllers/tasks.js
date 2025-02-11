const Task = require('../models/task');
const User = require('../models/user');

// ステータス更新のポイント定義
const STATUS_POINTS = {
  intelligence: 10,
  emotional: 10,
  health: 10,
  social: 10,
  wealth: 10
};

// タスク一覧の取得
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// タスクの作成
exports.createTask = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    res.status(201).json(task);
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
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }

    // タスクの所有者確認
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'このタスクを更新する権限がありません' });
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

    res.status(200).json(task);
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

// タスクの削除
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'タスクが見つかりません' });
    }

    // タスクの所有者確認
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'このタスクを削除する権限がありません' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'タスクを削除しました' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ユーザーのステータス取得
exports.getUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 