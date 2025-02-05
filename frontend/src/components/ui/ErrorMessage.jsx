import { AlertTriangle } from 'lucide-react';

export function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
} 