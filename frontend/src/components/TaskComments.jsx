import { useState, useEffect } from 'react';
import { MessageSquare, Edit2, Trash2, Save, X } from 'lucide-react';
import { commentApi } from '../services/api';
import { LoadingSpinner } from './ui/Loading';

export function TaskComments({ taskId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // コメント一覧の取得
  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const data = await commentApi.fetchComments(taskId);
        setComments(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  // コメントの追加
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const comment = await commentApi.createComment(taskId, newComment.trim());
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // コメントの更新
  const handleUpdateComment = async (id) => {
    if (!editText.trim()) return;

    setIsLoading(true);
    try {
      const updated = await commentApi.updateComment(id, editText.trim());
      setComments(prev =>
        prev.map(comment => comment._id === id ? updated : comment)
      );
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // コメントの削除
  const handleDeleteComment = async (id) => {
    if (!window.confirm('このコメントを削除してもよろしいですか？')) return;

    setIsLoading(true);
    try {
      await commentApi.deleteComment(id);
      setComments(prev => prev.filter(comment => comment._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 編集の開始
  const startEditing = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  // 編集のキャンセル
  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    const intervals = {
      年: 31536000,
      ヶ月: 2592000,
      週間: 604800,
      日: 86400,
      時間: 3600,
      分: 60,
      秒: 1
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval}${unit}前`;
      }
    }
    return 'たった今';
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        コメント
      </h3>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* コメント入力フォーム */}
      <form onSubmit={handleAddComment} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="コメントを入力..."
          className="w-full h-24 px-4 py-2 rounded-xl border-0 bg-gray-50 shadow-inner focus:ring-2 focus:ring-indigo-500 resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newComment.trim()}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <LoadingSpinner className="w-4 h-4" />}
          コメントを追加
        </button>
      </form>

      {/* コメント一覧 */}
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment._id} className="bg-gray-50 rounded-xl p-3">
            {editingId === comment._id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-0 bg-white shadow-inner focus:ring-2 focus:ring-indigo-500 resize-none"
                  disabled={isLoading}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={cancelEditing}
                    disabled={isLoading}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateComment(comment._id)}
                    disabled={isLoading || !editText.trim()}
                    className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-900 mb-2">{comment.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {getTimeAgo(comment.createdAt)}
                    {comment.updatedAt !== comment.createdAt && ' (編集済み)'}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(comment)}
                      disabled={isLoading}
                      className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      disabled={isLoading}
                      className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 