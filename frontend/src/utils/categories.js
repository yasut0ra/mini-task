import { 
  Brain, 
  Heart, 
  Activity, 
  Users, 
  Coins,
  BookOpen,
  Palette,
  Dumbbell,
  MessageCircle,
  LineChart
} from 'lucide-react';

export const statusCategories = [
  {
    id: 'intelligence',
    label: '知性',
    icon: Brain,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: '学習、研究、知識の獲得に関連するタスク',
    tags: [
      { id: 'study', label: '学習' },
      { id: 'research', label: '研究' },
      { id: 'reading', label: '読書' },
      { id: 'programming', label: 'プログラミング' },
      { id: 'problem-solving', label: '問題解決' }
    ],
    tagIcon: BookOpen
  },
  {
    id: 'emotional',
    label: '感情',
    icon: Heart,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: '感情的な成長、趣味、芸術活動に関連するタスク',
    tags: [
      { id: 'meditation', label: '瞑想' },
      { id: 'hobby', label: '趣味' },
      { id: 'art', label: '芸術' },
      { id: 'music', label: '音楽' },
      { id: 'self-improvement', label: '自己啓発' }
    ],
    tagIcon: Palette
  },
  {
    id: 'health',
    label: '健康',
    icon: Activity,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: '身体的な健康、運動、生活習慣に関連するタスク',
    tags: [
      { id: 'exercise', label: '運動' },
      { id: 'sleep', label: '睡眠' },
      { id: 'diet', label: '食事' },
      { id: 'yoga', label: 'ヨガ' },
      { id: 'walking', label: '散歩' }
    ],
    tagIcon: Dumbbell
  },
  {
    id: 'social',
    label: '社会性',
    icon: Users,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    description: '人間関係、コミュニケーション、社会活動に関連するタスク',
    tags: [
      { id: 'communication', label: 'コミュニケーション' },
      { id: 'meeting', label: '会議' },
      { id: 'networking', label: 'ネットワーキング' },
      { id: 'presentation', label: 'プレゼン' },
      { id: 'teamwork', label: 'チーム活動' }
    ],
    tagIcon: MessageCircle
  },
  {
    id: 'wealth',
    label: '資産',
    icon: Coins,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: '金銭管理、投資、経済活動に関連するタスク',
    tags: [
      { id: 'investment', label: '投資' },
      { id: 'asset-management', label: '資産管理' },
      { id: 'budgeting', label: '予算管理' },
      { id: 'income', label: '収入' },
      { id: 'expense', label: '支出' }
    ],
    tagIcon: LineChart
  }
];

// カテゴリーIDからカテゴリー情報を取得
export const getCategoryById = (categoryId) => {
  return statusCategories.find(category => category.id === categoryId);
};

// カテゴリーIDからタグ一覧を取得
export const getTagsByCategory = (categoryId) => {
  const category = getCategoryById(categoryId);
  return category ? category.tags : [];
};

// カテゴリーとタグIDから表示名を取得
export const getTagLabel = (categoryId, tagId) => {
  const category = getCategoryById(categoryId);
  if (!category) return '';
  
  const tag = category.tags.find(tag => tag.id === tagId);
  return tag ? tag.label : '';
};

// カテゴリーの色情報を取得
export const getCategoryColors = (categoryId) => {
  const category = getCategoryById(categoryId);
  if (!category) return {
    text: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200'
  };
  
  return {
    text: category.color,
    bg: category.bgColor,
    border: category.borderColor
  };
}; 