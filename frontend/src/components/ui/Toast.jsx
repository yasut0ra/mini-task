import { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const VARIANTS = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 text-green-600 border-green-200'
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 text-red-600 border-red-200'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 text-blue-600 border-blue-200'
  }
};

export function Toast({ message, variant = 'info', duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const { icon: Icon, className } = VARIANTS[variant] || VARIANTS.info;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="p-1 hover:bg-black/5 rounded-full transition-colors duration-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
} 