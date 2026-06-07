# クイックスタート

5 分でプロジェクトを開始するための簡単なガイドです。

## 前提条件

- Node.js 18.17 以上
- npm, yarn, または pnpm

## 1️⃣ インストール

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd TemplateProject

# 依存パッケージをインストール
npm install
```

**Windows:** `scripts/setup.bat` で自動セットアップ可能
```bash
scripts/setup.bat
```

**macOS/Linux:** `scripts/setup.sh` で自動セットアップ可能
```bash
bash scripts/setup.sh
```

## 2️⃣ 環境変数を設定

```bash
# .env.example をコピー
cp .env.example .env.local

# .env.local を編集（必要に応じて）
```

## 3️⃣ 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開くと、テンプレートが表示されます。

## 4️⃣ コーディング開始

### ページを追加

```typescript
// src/pages/about.tsx
export default function About() {
  return <h1>About Page</h1>;
}
```

自動的に `/about` で アクセス可能になります。

### コンポーネントを作成

```typescript
// src/components/Card.tsx
interface CardProps {
  title: string;
  content: string;
}

export const Card: React.FC<CardProps> = ({ title, content }) => (
  <div className="border rounded p-4">
    <h2>{title}</h2>
    <p>{content}</p>
  </div>
);
```

### API ルートを作成

```typescript
// src/pages/api/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello from API' });
}
```

`/api/data` でアクセス可能です。

## 📦 デプロイ

### Vercel にデプロイ

```bash
# Vercel CLI をインストール
npm i -g vercel

# デプロイ
vercel
```

### 他のプラットフォーム

- **Netlify:** `npm run build` 後に `dist` フォルダをデプロイ
- **AWS:** `.next` フォルダを Lambda/EC2 にデプロイ
- **Docker:** Dockerfile を作成してコンテナ化

## 🔍 品質管理

開発時に以下のコマンドで品質をチェック：

```bash
# Lint チェック
npm run lint

# TypeScript チェック
npm run type-check

# コード フォーマット
npm run format

# テスト実行
npm run test

# ビルド確認
npm run build
```

## 📚 詳細情報

- [セットアップガイド](./SETUP.md)
- [開発ガイドライン](./DEVELOPMENT.md)
- [プロジェクト構造](./PROJECT_STRUCTURE.md)
- [API ドキュメント](./API.md)

## 🆘 トラブルシューティング

### ポート 3000 が既に使用されている

```bash
npm run dev -- -p 3001
```

### モジュールエラー

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript エラー

```bash
npm run type-check
```

## 🚀 次のステップ

1. コンポーネントやページを追加
2. API ルートでバックエンド実装
3. テストを書く
4. GitHub で管理
5. Vercel などでデプロイ

Happy Coding! 🎉
