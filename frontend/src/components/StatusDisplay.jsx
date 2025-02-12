import { useState, useEffect } from 'react';
import { statusCategories } from '../utils/constants';
import { authApi } from '../services/api';
import { Brain, Heart, Activity, Users, Coins } from 'lucide-react';

function StatusDisplay() {
  const [statusPoints, setStatusPoints] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatusPoints = async () => {
      try {
        const userData = await authApi.getProfile();
        setStatusPoints(userData.statusPoints);
      } catch (error) {
        console.error('ステータスの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatusPoints();
  }, []);

  // レベル計算関数
  const calculateLevel = (points) => {
    return Math.floor(points / 100) + 1;
  };

  // 次のレベルまでの残りポイントを計算
  const calculateRemainingPoints = (points) => {
    const currentLevel = calculateLevel(points);
    return currentLevel * 100 - points;
  };

  // レーダーチャートのポイントを計算
  const calculateChartPoints = () => {
    if (!statusPoints) return '';
    const radius = 150;
    const points = statusCategories.map((category, i) => {
      const angle = (Math.PI * 2 * i) / statusCategories.length - Math.PI / 2;
      const value = statusPoints[category.id] || 0;
      const normalizedValue = Math.min(value / 500, 1); // 最大500ポイントを1として正規化
      return {
        x: radius * normalizedValue * Math.cos(angle) + radius,
        y: radius * normalizedValue * Math.sin(angle) + radius
      };
    });
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">ステータス</h2>

      {/* レーダーチャート */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="relative w-[300px] h-[300px] mx-auto">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {/* 背景の五角形 */}
            {[5, 4, 3, 2, 1].map((level) => {
              const points = statusCategories.map((_, i) => {
                const angle = (Math.PI * 2 * i) / statusCategories.length - Math.PI / 2;
                const radius = 150 * (level / 5);
                return {
                  x: radius * Math.cos(angle) + 150,
                  y: radius * Math.sin(angle) + 150
                };
              });
              const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
              return (
                <polygon
                  key={level}
                  points={pointsStr}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              );
            })}
            {/* ステータス値の五角形 */}
            <polygon
              points={calculateChartPoints()}
              fill="rgba(99, 102, 241, 0.2)"
              stroke="#6366f1"
              strokeWidth="2"
            />
            {/* カテゴリーラベル */}
            {statusCategories.map((category, i) => {
              const angle = (Math.PI * 2 * i) / statusCategories.length - Math.PI / 2;
              const x = 180 * Math.cos(angle) + 150;
              const y = 180 * Math.sin(angle) + 150;
              const Icon = category.icon;
              return (
                <g key={category.id}>
                  <circle
                    cx={x}
                    cy={y}
                    r="20"
                    fill="white"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                  <foreignObject
                    x={x - 10}
                    y={y - 10}
                    width="20"
                    height="20"
                    className={category.color}
                  >
                    <Icon className="w-5 h-5" />
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statusCategories.map(category => {
          const points = statusPoints?.[category.id] || 0;
          const level = calculateLevel(points);
          const remaining = calculateRemainingPoints(points);
          const Icon = category.icon;

          return (
            <div key={category.id} className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${category.color.replace('text-', 'bg-').replace('500', '100')}`}>
                  <Icon className={`w-6 h-6 ${category.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.label}</h3>
                  <p className="text-sm text-gray-500">レベル {level}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">現在のポイント</span>
                  <span className="font-medium text-gray-900">{points} pt</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">次のレベルまで</span>
                  <span className="font-medium text-gray-900">{remaining} pt</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${category.color.replace('text-', 'bg-')}`}
                    style={{ width: `${(points % 100) / 100 * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatusDisplay; 