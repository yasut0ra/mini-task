import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { analyticsApi } from '../services/api';
import { LoadingSpinner } from './ui/Loading';
import { AlertTriangle, CheckCircle, Clock, ListTodo } from 'lucide-react';

// Chart.jsの設定
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

export default function Analytics({ tasks }) {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsApi.fetchStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner className="w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl">
        {error}
      </div>
    );
  }

  // 概要カード
  const OverviewCard = ({ icon: Icon, title, value, subValue, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${color} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subValue && (
            <p className="text-sm text-gray-500">{subValue}</p>
          )}
        </div>
      </div>
    </div>
  );

  // 優先度別のドーナツチャートデータ
  const priorityChartData = {
    labels: ['高', '中', '低'],
    datasets: [{
      data: [
        stats.byPriority.find(p => p._id === 'high')?.count || 0,
        stats.byPriority.find(p => p._id === 'medium')?.count || 0,
        stats.byPriority.find(p => p._id === 'low')?.count || 0
      ],
      backgroundColor: [
        'rgb(239, 68, 68)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)'
      ]
    }]
  };

  // カテゴリー別の棒グラフデータ
  const categoryChartData = {
    labels: stats.byCategory.map(c => c._id),
    datasets: [
      {
        label: '完了',
        data: stats.byCategory.map(c => c.completed),
        backgroundColor: 'rgb(79, 70, 229)',
      },
      {
        label: '未完了',
        data: stats.byCategory.map(c => c.count - c.completed),
        backgroundColor: 'rgb(209, 213, 219)',
      }
    ]
  };

  // 月別の折れ線グラフデータ
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const monthlyChartData = {
    labels: stats.monthly.map(m => `${monthNames[m._id.month - 1]}`),
    datasets: [
      {
        label: '総タスク数',
        data: stats.monthly.map(m => m.total),
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
      },
      {
        label: '完了タスク',
        data: stats.monthly.map(m => m.completed),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
      }
    ]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        タスク分析
      </h2>

      {/* 概要カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          icon={ListTodo}
          title="総タスク数"
          value={stats.overview.total}
          color="bg-indigo-600"
        />
        <OverviewCard
          icon={CheckCircle}
          title="完了率"
          value={`${stats.overview.completionRate}%`}
          subValue={`${stats.overview.completed}/${stats.overview.total} 完了`}
          color="bg-green-600"
        />
        <OverviewCard
          icon={AlertTriangle}
          title="期限切れ"
          value={stats.overview.overdue}
          color="bg-red-600"
        />
        <OverviewCard
          icon={Clock}
          title="残りのタスク"
          value={stats.overview.total - stats.overview.completed}
          color="bg-yellow-600"
        />
      </div>

      {/* チャート */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            優先度別のタスク
          </h3>
          <div className="h-64">
            <Doughnut
              data={priorityChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            カテゴリー別の進捗
          </h3>
          <div className="h-64">
            <Bar
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true }
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            月別のタスク推移
          </h3>
          <div className="h-64">
            <Line
              data={monthlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    }
                  }
                },
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 