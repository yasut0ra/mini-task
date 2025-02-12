# MiniTask

モダンなタスク管理アプリケーション。React、Node.js、MongoDB を使用して構築されています。
- URL：mini-task-puce.vercel.app
- 完成イメージ：https://lambent-lolly-5e5cdb.netlify.app

## 主な機能

- タスクの作成、編集、削除
- リアルタイムなステータス更新
- コメント機能
- 高度なフィルタリング機能
  - ステータス
  - 優先度
  - 期限
  - カテゴリー
- レスポンシブデザイン

## 技術スタック

### フロントエンド
- React
- TailwindCSS
- Lucide Icons
- Axios

### バックエンド
- Node.js
- Express
- MongoDB
- Mongoose

## セットアップ手順

### 必要条件
- Node.js
- MongoDB

### インストール

1. リポジトリのクローン
bash
git clone https://github.com/yasut0ra/mini-task.git
cd mini-task

2. フロントエンドの依存関係をインストール
cd frontend
npm install


3. バックエンドの依存関係をインストール
cd ../backend
npm install


4. 環境変数の設定
backend/.env
MONGODB_URI=your_mongodb_uri
PORT=5000


5. 開発サーバーの起動
バックエンド:
cd backend
npm run dev

フロントエンド:
cd frontend
npm run dev
