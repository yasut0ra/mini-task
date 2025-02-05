import { Settings, Moon, Sun, Bell } from 'lucide-react';

function Setting() {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">設定</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">ダークモード</span>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Moon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">通知</span>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Setting; 