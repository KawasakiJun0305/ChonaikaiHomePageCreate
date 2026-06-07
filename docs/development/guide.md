# 開発ガイドライン

## コンテンツの更新方法

### お知らせを追加する（`/news`）

`src/pages/news.tsx` の `newsItems` 配列に追記します。

```ts
{
  id: 7,
  date: '2026年7月1日',
  category: 'event' as NewsCategory,
  title: '〇〇のお知らせ',
  body: '本文をここに記入します。',
},
```

カテゴリーは `event` / `news` / `important` / `garbage` の4種類です。

### トップページのお知らせを更新する（`/`）

`src/pages/index.tsx` の `latestNews` 配列を直接編集します。`/news` と同期が必要な場合は手動で揃えてください。

### 年間行事カレンダーを更新する（`/activities`）

`src/pages/activities.tsx` の `annualEvents` 配列を編集します。

---

## 新しいページを追加する

1. `src/pages/` 以下に `新ページ名.tsx` を作成します（例: `history.tsx` → URL は `/history`）
2. `<Head>` でタイトル・description を設定します
3. `src/components/Header.tsx` のナビゲーションリンクに追記します

---

## スタイリング

### Tailwind CSS

クラスは Tailwind のユーティリティクラスを使います。プロジェクト固有のクラスは `src/styles/globals.css` の `@layer components` に定義されています。

よく使うクラス：

| クラス | 用途 |
|--------|------|
| `card` | 白いカードコンテナ |
| `btn-primary` | kasama-green の塗りボタン |
| `btn-outline` | kasama-green アウトラインボタン |
| `section-title` | セクション見出し（緑の左ボーダー付き） |
| `page-hero` | ページ上部のヒーローバナー |
| `badge-event` / `badge-news` / `badge-important` / `badge-garbage` | カテゴリーバッジ |

### ブランドカラー

| CSS クラス | 用途 |
|---------|------|
| `text-kasama-green` / `bg-kasama-green` | メインカラー（緑） |
| `text-kasama-darkgreen` / `bg-kasama-darkgreen` | ダークグリーン |

---

## コード規約

### TypeScript

`strict` モードが有効です。`any` は使わず、型を明示してください。

```ts
// NG
const item: any = getItem();

// OK
const item: NewsItem = getItem();
```

### コンポーネント

```tsx
// src/components/ExampleCard.tsx
interface ExampleCardProps {
  title: string;
  body: string;
}

export default function ExampleCard({ title, body }: ExampleCardProps) {
  return (
    <div className="card">
      <h3 className="font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{body}</p>
    </div>
  );
}
```

### 定数・設定値

新しいカテゴリーや設定値は `src/lib/constants.ts` に追加し、ページファイルで直接定義しないようにします。

---

## Git ワークフロー

### ブランチ命名

| プレフィックス | 用途 |
|----------|------|
| `feature/` | 新機能・新ページ |
| `fix/` | バグ修正 |
| `content/` | コンテンツ更新（お知らせ・日程等） |
| `docs/` | ドキュメント |

### コミットメッセージ

```
content: 夏祭り2026のお知らせを追加
feat: 過去のお知らせアーカイブページを追加
fix: ゴミ収集カレンダーの曜日表記を修正
```

---

## 依存パッケージの更新

```bash
# 更新確認
npm outdated

# マイナー・パッチ更新
npm update

# メジャーバージョン更新（動作確認必須）
npm install パッケージ名@latest
```

Next.js・React のメジャーバージョンアップは、公式マイグレーションガイドを参照してから実施してください。
