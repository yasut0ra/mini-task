import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ className = '' }) {
  return (
    <Loader2 className={`animate-spin ${className}`} />
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3">
        <LoadingSpinner className="w-5 h-5 text-indigo-600" />
        <p className="text-gray-600">読み込み中...</p>
      </div>
    </div>
  );
}

export function TaskListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm"
        >
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-3 bg-gray-200 rounded w-20" />
            </div>
          </div>
          <div className="w-5 h-5 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export function TaskDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-24 bg-gray-200 rounded w-full" />
          <div className="h-8 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
} 