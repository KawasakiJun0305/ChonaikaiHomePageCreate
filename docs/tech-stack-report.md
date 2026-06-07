# 技術スタックレポート — 笠間町内会ホームページ

> 生成日: 2026年06月07日  
> プロジェクト: ChonaikaiHomePageCreate

---

## 1. プロジェクト概要

横浜市栄区笠間町内会の公式ホームページ。町内会員・地域住民向けに
お知らせ・ゴミ収集・防災情報・活動紹介などを提供する静的中心のWebサイト。

---

## 2. 技術スタック一覧

| カテゴリ | 技術 | バージョン | 用途・選定理由 |
|---------|------|-----------|--------------|
| フレームワーク | Next.js | ^14.0.0 | Reactベースで静的生成(SSG)に対応。更新頻度の低い町内会サイトに高速配信が最適。Pages Routerを採用し学習コストを抑制。 |
| UI ライブラリ | React | ^18.2.0 | UIをコンポーネント単位で管理。ヘッダー・フッター・カードを再利用できる。 |
| 言語 | TypeScript | ^5.0.0 | 型安全性により実行前にバグを検出。`strict: true` + 未使用変数検出で長期メンテナンスに強い。 |
| スタイリング | Tailwind CSS | ^3.4.19 | クラス名でスタイルを直書きできるためCSSファイルの別管理が不要。kasamaブランドカラーをカスタム定義済み。 |
| CSS変換 | PostCSS | ^8.5.15 | Tailwindを動かすための変換ツール。 |
| ブラウザ互換 | Autoprefixer | ^10.5.0 | 古いブラウザでも動くようCSSを自動調整（高齢者利用を想定）。 |
| アイコン | lucide-react | ^1.17.0 | SVGアイコンをReactコンポーネントとして使用。Home / Menu / Megaphone / Trash2 / ShieldAlert などを利用中。 |
| テスト | Jest | ^29.0.0 | JavaScriptのデファクトスタンダードなテストフレームワーク。 |
| テスト | @testing-library/react | ^14.0.0 | 実際のユーザー操作を模したコンポーネントテスト。 |
| テスト | @testing-library/jest-dom | ^6.0.0 | `toBeInTheDocument()` などDOM専用マッチャーを追加。 |
| Linter | ESLint | ^8.0.0 | `next/core-web-vitals` ベース。Hooksルール・imgタグ誤用を自動検出。 |
| フォーマッター | Prettier | ^3.0.0 | コード整形を自動化。行幅100・シングルクォート・セミコロンありで統一。 |
| ランタイム | Node.js | 20.x (.nvmrc) | ビルド・開発サーバーの実行環境。CI/CDもNode.js 20で統一。 |

---

## 3. ディレクトリ構成

```
src/
├── components/          # 再利用UIパーツ
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   └── __tests__/
│       └── Button.test.tsx
├── pages/               # URL = ファイル名（Pages Router）
│   ├── index.tsx         # / トップページ
│   ├── news.tsx          # /news お知らせ
│   ├── activities.tsx    # /activities 活動紹介
│   ├── garbage.tsx       # /garbage ゴミ収集
│   ├── disaster.tsx      # /disaster 防災情報
│   ├── contact.tsx       # /contact お問い合わせ
│   ├── login.tsx         # /login ログイン（実装中）
│   ├── _app.tsx          # アプリ全体のラッパー
│   ├── _document.tsx     # HTMLドキュメント定義
│   └── api/
│       ├── hello.ts      # APIサンプル
│       └── auth.ts       # 認証API（実装中）
├── middleware.ts         # ミドルウェア（ルートガード等）
├── hooks/
│   └── useFetch.ts       # データ取得カスタムフック
├── utils/
│   └── helpers.ts        # 汎用ヘルパー関数
├── types/
│   └── index.ts          # 型定義（ApiResponse<T>, User等）
├── lib/
│   └── constants.ts      # 定数（NewsCategory, SITE_NAME等）
└── styles/
    └── globals.css       # グローバルCSS + Tailwind読み込み
```

---

## 4. アーキテクチャ概要

```
ブラウザ
  │
  ▼
middleware.ts（認証ガード・ルート保護）
  │
  ▼
Next.js Pages Router
  ├── /          → pages/index.tsx
  ├── /news      → pages/news.tsx
  ├── /garbage   → pages/garbage.tsx
  ├── /disaster  → pages/disaster.tsx
  ├── /activities→ pages/activities.tsx
  ├── /contact   → pages/contact.tsx
  ├── /login     → pages/login.tsx
  └── /api/*     → pages/api/（hello, auth）
         │
         ▼
  Layout.tsx（Header + コンテンツ + Footer）
         │
         ▼
  Tailwind CSS（kasamaカラー） + lucide-react（アイコン）
```

- **データ管理**: 静的データ（ソースコード直書き）/ 将来的にCMS連携可能な設計
- **認証**: `login.tsx` + `api/auth.ts` + `middleware.ts` で実装中
- **データベース**: 現状なし

---

## 5. 開発環境セットアップ

```bash
# 依存インストール
npm install

# 開発サーバー起動
npm run dev      # http://localhost:3000

# 品質チェック
npm run lint         # ESLint
npm run type-check   # TypeScript
npm run format       # Prettier 整形
npm run format:check # 整形要否確認

# テスト
npm test
npm run test:coverage

# 本番ビルド
npm run build
npm start
```

---

## 6. コード品質設定

### ESLint
- ベース: `next/core-web-vitals`
- Hooks ルール厳守（`react-hooks/rules-of-hooks`: error）
- img タグ警告（`@next/next/no-img-element`: warn）

### Prettier（.prettierrc.json）
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### TypeScript（tsconfig.json）
- `strict: true`（厳格モード）
- `noUnusedLocals: true` / `noUnusedParameters: true`（未使用変数もエラー）
- `noFallthroughCasesInSwitch: true`
- パスエイリアス: `@/` → `src/`
- ターゲット: ES2020

---

## 7. CI/CD パイプライン

| Workflow | トリガー | 内容 |
|----------|---------|------|
| `ci.yml` | push/PR（main・develop） | テスト → ESLint → 型チェック → ビルド |
| `deploy.yml` | push（main）・手動 | テスト → ビルド → デプロイ（設定中） |

---

## 8. カスタムデザインシステム

### kasamaブランドカラー

| Tailwindクラス | カラーコード | 用途 |
|--------------|------------|------|
| `kasama-green` | `#2d6a4f` | メインカラー（ヘッダー・ボタン） |
| `kasama-darkgreen` | `#1b4332` | ダークバリアント |
| `kasama-blue` | `#1565c0` | リンク・アクセント |
| `kasama-lightblue` | `#e3f2fd` | 背景・ハイライト |
| `kasama-gold` | `#f9a825` | 重要情報・バッジ |
| `kasama-cream` | `#fafaf7` | 全体背景 |

### 日本語フォントスタック
```
Noto Sans JP → Yu Gothic → 游ゴシック → Meiryo → メイリオ → sans-serif
```

### 再利用カスタムクラス（globals.css）
| クラス | 用途 |
|--------|------|
| `.btn-primary` / `.btn-outline` | ボタン統一スタイル |
| `.card` | カード型コンテンツ枠 |
| `.section-title` | 各セクションの見出し |
| `.badge` / `.badge-event` / `.badge-news` / `.badge-important` / `.badge-garbage` | 分類バッジ |
| `.form-input` | フォーム入力欄 |

---

## 9. パスエイリアス一覧

| エイリアス | 実パス |
|-----------|-------|
| `@/*` | `src/*` |
| `@/components/*` | `src/components/*` |
| `@/pages/*` | `src/pages/*` |
| `@/utils/*` | `src/utils/*` |
| `@/types/*` | `src/types/*` |
| `@/hooks/*` | `src/hooks/*` |
| `@/lib/*` | `src/lib/*` |
| `@/styles/*` | `src/styles/*` |
