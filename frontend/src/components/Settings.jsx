import { useState } from 'react';
import { Moon, Sun, Bell, Globe } from 'lucide-react';

function Settings() {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(false);
  const [notifyBefore, setNotifyBefore] = useState('30');
  const [notificationSound, setNotificationSound] = useState('default');
  const [language, setLanguage] = useState('ja');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">設定</h2>

      <div className="space-y-4">
        {/* テーマ設定 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Sun className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">テーマ設定</h3>
                <p className="text-sm text-gray-500">アプリの表示モードを設定します</p>
              </div>
            </div>
            <select 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="rounded-lg border-gray-300 text-gray-700"
            >
              <option value="light">ライト</option>
              <option value="dark">ダーク</option>
              <option value="system">システム設定に従う</option>
            </select>
          </div>
        </div>

        {/* 通知設定 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">通知設定</h3>
                <p className="text-sm text-gray-500">タスクの通知方法を設定します</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          <div className="space-y-4 pl-11">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">期限前の通知</label>
              <select 
                value={notifyBefore}
                onChange={(e) => setNotifyBefore(e.target.value)}
                className="rounded-lg border-gray-300 text-sm text-gray-700"
              >
                <option value="30">30分前</option>
                <option value="60">1時間前</option>
                <option value="1440">1日前</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">通知音</label>
              <select 
                value={notificationSound}
                onChange={(e) => setNotificationSound(e.target.value)}
                className="rounded-lg border-gray-300 text-sm text-gray-700"
              >
                <option value="default">デフォルト</option>
                <option value="bell">ベル</option>
                <option value="chime">チャイム</option>
              </select>
            </div>
          </div>
        </div>

        {/* 言語設定 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">言語設定</h3>
                <p className="text-sm text-gray-500">アプリの表示言語を設定します</p>
              </div>
            </div>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-lg border-gray-300 text-gray-700"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ko">한국어</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 