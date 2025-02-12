import { Brain, Heart, Activity, Users, Coins } from 'lucide-react';

export const statusCategories = [
  {
    id: 'intelligence',
    label: '知性',
    icon: Brain,
    color: 'text-blue-500',
    tags: ['学習', '研究', '問題解決', '読書', 'プログラミング']
  },
  {
    id: 'emotional',
    label: '感情',
    icon: Heart,
    color: 'text-purple-500',
    tags: ['瞑想', 'リラックス', '趣味', '芸術', '自己啓発']
  },
  {
    id: 'health',
    label: '健康',
    icon: Activity,
    color: 'text-green-500',
    tags: ['運動', '睡眠', '食事', 'ヨガ', '散歩']
  },
  {
    id: 'social',
    label: '社会性',
    icon: Users,
    color: 'text-orange-500',
    tags: ['コミュニケーション', '会議', 'ネットワーキング', 'プレゼン', 'チーム活動']
  },
  {
    id: 'wealth',
    label: '資産',
    icon: Coins,
    color: 'text-indigo-500',
    tags: ['投資', '資産管理', '予算管理', '収入', '支出']
  }
];

export const getCategoryById = (id) => {
  return statusCategories.find(category => category.id === id);
}; 