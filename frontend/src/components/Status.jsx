import React from 'react';
import { 
  Brain, 
  Heart, 
  Activity, 
  Users, 
  Coins, 
  TrendingUp, 
  History, 
  Award 
} from 'lucide-react';
import { calculateLevelProgress, getStatusColor } from '../utils/status';
import StatusDisplay from './StatusDisplay';

const statusConfigs = [
  {
    type: 'intelligence',
    icon: Brain,
    label: '知性',
    description: 'タスクの効率と問題解決能力',
    examples: ['学習', '研究', '読書', 'プログラミング']
  },
  {
    type: 'emotional',
    icon: Heart,
    label: '感情',
    description: 'ストレス耐性とモチベーション',
    examples: ['瞑想', 'リラックス', '趣味', '芸術']
  },
  {
    type: 'health',
    icon: Activity,
    label: '健康',
    description: '体力と生活習慣',
    examples: ['運動', '睡眠', '食事', 'ヨガ']
  },
  {
    type: 'social',
    icon: Users,
    label: '社会性',
    description: 'コミュニケーションと影響力',
    examples: ['会議', 'ネットワーキング', 'プレゼン', 'チーム活動']
  },
  {
    type: 'wealth',
    icon: Coins,
    label: '資産',
    description: '資源管理と経済力',
    examples: ['投資', '資産管理', '予算管理', '収入']
  }
];

export default function Status({ status }) {
  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">ステータス</h2>
          <p className="text-gray-500">タスクの完了で成長するキャラクターステータス</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-gray-600 hover:text-gray-900">
            <History className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 text-gray-600 hover:text-gray-900">
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* レーダーチャート */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <StatusDisplay status={status} />
      </div>

      {/* 詳細なステータスカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statusConfigs.map(config => {
          const currentStatus = status[config.type];
          const progress = calculateLevelProgress(
            currentStatus.experience,
            currentStatus.nextLevelExp
          );

          return (
            <div key={config.type} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getStatusColor(config.type)}`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{config.label}</h3>
                      <p className="text-sm text-gray-500">{config.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-2xl font-bold bg-gradient-to-br ${getStatusColor(config.type)} bg-clip-text text-transparent`}>
                        Lv.{currentStatus.level}
                      </span>
                      <div className="text-sm text-gray-500">
                        次のレベルまで: {currentStatus.nextLevelExp - currentStatus.experience} exp
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r ${getStatusColor(config.type)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {config.examples.map(example => (
                      <span
                        key={example}
                        className="px-2 py-1 text-sm rounded-lg bg-gray-100 text-gray-600"
                      >
                        {example}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">累計経験値</span>
                      <span className="text-gray-900">{currentStatus.experience} exp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 最近のステータス獲得履歴 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          最近の成長
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Brain className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700">知性 +10</span>
            </div>
            <span className="text-sm text-gray-500">5分前</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-purple-500" />
              <span className="text-gray-700">感情 +5</span>
            </div>
            <span className="text-sm text-gray-500">15分前</span>
          </div>
        </div>
      </div>
    </div>
  );
} 