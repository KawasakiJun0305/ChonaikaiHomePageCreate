# セットアップガイド

## 前提条件

| ツール | バージョン |
|--------|---------|
| Node.js | 18.17 以上 |
| npm | 9.0 以上 |

バージョン確認：

```bash
node --version
npm --version
```

## インストール手順

### 1. リポジトリをクローン

```bash
git clone <repository-url>
cd ChonaikaiHomePageCreate
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## VSCode 推奨設定

`.vscode/settings.json` に以下を設定すると、保存時に自動フォーマットが適用されます。

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

推奨拡張機能：
- ESLint
- Prettier - Code Formatter
- Tailwind CSS IntelliSense

## 環境変数

現時点では環境変数の設定は不要です。メール送信先 (`kasama-chonaikai@example.com`) を変更する場合は `src/pages/contact.tsx` を直接編集してください。

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー起動 |
| `npm run lint` | ESLint 実行 |
| `npm run type-check` | TypeScript 型チェック |
| `npm run format` | Prettier フォーマット |
| `npm run format:check` | フォーマット状況チェック |

## トラブルシューティング

**ポート 3000 が使用中の場合**

```bash
npm run dev -- -p 3001
```

**ビルドキャッシュのクリア**

```bash
Remove-Item -Recurse -Force .next
npm run build
```

**node_modules の再インストール**

```bash
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```
