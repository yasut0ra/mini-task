import { AlertTriangle, XCircle, X } from 'lucide-react';

export function ErrorMessage({ message, onClose }) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto pl-3"
            >
              <X className="h-5 w-5 text-red-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 