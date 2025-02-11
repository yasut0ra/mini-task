// レベル進捗を計算する関数
export const calculateLevelProgress = (currentExp, nextLevelExp) => {
  return (currentExp / nextLevelExp) * 100;
};

// ステータスの色を取得する関数
export const getStatusColor = (type) => {
  const colors = {
    intelligence: 'from-blue-500 to-blue-600',
    emotional: 'from-purple-500 to-purple-600',
    health: 'from-green-500 to-green-600',
    social: 'from-orange-500 to-orange-600',
    wealth: 'from-indigo-500 to-indigo-600'
  };
  return colors[type] || 'from-gray-500 to-gray-600';
}; 