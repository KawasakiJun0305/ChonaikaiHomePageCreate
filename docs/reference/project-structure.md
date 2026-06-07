# プロジェクト構造

## ディレクトリツリー

```
ChonaikaiHomePageCreate/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
│
├── public/                        # 静的ファイル（画像・favicon等）
│
├── src/
│   ├── components/                # 共通UIコンポーネント
│   │   ├── __tests__/
│   │   │   └── Button.test.tsx
│   │   ├── Button.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx             # グローバルナビゲーション
│   │   └── Layout.tsx             # Header+Footer のラッパー
│   │
│   ├── hooks/
│   │   └── useFetch.ts
│   │
│   ├── lib/
│   │   └── constants.ts           # SITE_NAME・SITE_DESCRIPTION・CATEGORY_CONFIG
│   │
│   ├── pages/                     # Next.js ページ（ファイル名 = URLパス）
│   │   ├── api/
│   │   │   └── hello.ts
│   │   ├── _app.tsx               # グローバルレイアウト適用
│   │   ├── _document.tsx          # HTML文書構造
│   │   ├── index.tsx              # / トップページ
│   │   ├── news.tsx               # /news お知らせ
│   │   ├── garbage.tsx            # /garbage ゴミ収集情報
│   │   ├── disaster.tsx           # /disaster 防災情報
│   │   ├── activities.tsx         # /activities 活動紹介
│   │   └── contact.tsx            # /contact お問い合わせ
│   │
│   ├── styles/
│   │   └── globals.css            # グローバルCSS・Tailwindユーティリティクラス定義
│   │
│   ├── types/
│   │   └── index.ts               # 共通型定義
│   │
│   └── utils/
│       └── helpers.ts
│
├── docs/                          # プロジェクトドキュメント
│   ├── requirements/              # 要件定義・設計書
│   ├── SETUP.md
│   ├── DEVELOPMENT.md
│   └── PROJECT_STRUCTURE.md      # 本ファイル
│
├── .eslintrc.json
├── .prettierrc.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## 重要ファイルの説明

### `src/lib/constants.ts`

サイト全体で使う定数を管理します。

```ts
export const SITE_NAME = '笠間町内会';
export const SITE_DESCRIPTION = '...';
export type NewsCategory = 'event' | 'news' | 'important' | 'garbage';
export const CATEGORY_CONFIG: Record<NewsCategory, { label: string; className: string }> = {...};
```

カテゴリーラベルやバッジのクラス名はここで一元管理しています。

### `src/styles/globals.css`

Tailwind のユーティリティクラスに加え、プロジェクト固有の再利用クラスを `@layer components` で定義しています。

| クラス名 | 用途 |
|---------|------|
| `.card` | 白背景・角丸・シャドウのカードコンテナ |
| `.btn-primary` | kasama-green の塗りボタン |
| `.btn-outline` | kasama-green のアウトラインボタン |
| `.badge-*` | カテゴリーバッジ（event / news / important / garbage） |
| `.section-title` | セクション見出し |
| `.page-hero` | ページヒーローバナー |
| `.form-input` | フォーム入力フィールド |

### `src/pages/_app.tsx`

すべてのページに `<Layout>` を適用しています。ページ固有のレイアウト変更が必要な場合は `getLayout` パターンを使います。

## ページデータについて

現時点のコンテンツデータ（お知らせ・イベント一覧等）は各ページファイル内に静的配列として定義されています。将来的にCMS連携を行う際は `getStaticProps` / `getServerSideProps` への移行が容易な構造になっています。

## ブランドカラー

`tailwind.config.js` に `kasama-green` と `kasama-darkgreen` が追加カラーとして定義されています。

## ファイル命名規則

| 種別 | 規則 | 例 |
|------|------|----|
| React コンポーネント | PascalCase | `Header.tsx` |
| ページ | kebab-case | `garbage.tsx` |
| フック | camelCase (use プレフィックス) | `useFetch.ts` |
| ユーティリティ | camelCase | `helpers.ts` |
| 型定義 | index.ts に集約 | `src/types/index.ts` |
