# 基本設計書

**プロジェクト名:** 笠間町内会 公式ホームページ
**作成日:** 2026-06-07
**最終更新日:** 2026-06-07

---

## 1. システムアーキテクチャ

### 1.1 全体構成

```
ブラウザ（PC・スマホ）
    │
    │ HTTPS
    ▼
静的ホスティング（Vercel / GitHub Pages 等）
    │
    │ HTML / CSS / JS（ビルド済み）
    ▼
Next.js SSG（Static Site Generation）
    │
    └── 各ページ（index / news / garbage / disaster / activities / contact）
```

### 1.2 レンダリング方式

| ページ | 方式 | 理由 |
|--------|------|------|
| 全ページ | SSG（`getStaticProps` 不使用の静的エクスポート） | コンテンツが静的でサーバーレス運用可能 |

将来的にCMS連携を追加する場合は、`getStaticProps` + ISR（Incremental Static Regeneration）への移行を検討します。

---

## 2. ディレクトリ構成とモジュール分割

```
src/
├── pages/          # ルーティング（ファイル名 = URL）
├── components/     # 再利用UIコンポーネント
├── lib/            # 定数・設定
├── styles/         # グローバルCSS
├── types/          # 型定義
├── hooks/          # カスタムフック
└── utils/          # ユーティリティ関数
```

### 2.1 コンポーネント責務

| コンポーネント | 責務 |
|----------|------|
| `Layout` | Header + main + Footer を組み合わせるラッパー |
| `Header` | グローバルナビゲーション・ロゴ |
| `Footer` | 著作権・連絡先 |
| `Button` | 汎用ボタン |

### 2.2 定数管理

`src/lib/constants.ts` でサイト全体の設定値を一元管理：

- `SITE_NAME`：サイト名
- `SITE_DESCRIPTION`：メタ description
- `NewsCategory` 型
- `CATEGORY_CONFIG`：カテゴリーのラベル・バッジクラス名

---

## 3. データフロー

```
静的データ（各ページファイル内配列）
    │
    ▼
コンポーネント（props として受け取り表示）
    │
    ▼
HTML レンダリング（SSG）
    │
    ▼
ブラウザ表示
```

お問い合わせフォームのみ、クライアントサイドで `useState` により入力状態を管理し、送信時に `mailto:` リンクへリダイレクトします。

---

## 4. スタイリング設計

### 4.1 カラーパレット

| トークン | 用途 |
|---------|------|
| `kasama-green` | メインカラー（ナビ・ボタン・アクセント） |
| `kasama-darkgreen` | ホバー・強調色 |
| 赤系（`red-700` 等） | 防災ページ・緊急連絡先 |
| オレンジ系 | 燃やすゴミ・注意事項 |

### 4.2 共通 CSS クラス（`globals.css`）

頻出レイアウトを `@layer components` で定義し、各ページで再利用します。

```
.card         → 白背景・角丸・シャドウ・パディング
.btn-primary  → kasama-green 塗りボタン
.btn-outline  → kasama-green アウトラインボタン
.page-hero    → ページ上部のグリーンバナー
.section-title→ 緑のレフトボーダー付き見出し
.form-input   → フォーム入力フィールド
.badge-*      → カテゴリーバッジ（4種）
```

---

## 5. ナビゲーション設計

グローバルナビゲーション（`Header` コンポーネント）：

| リンク | パス |
|--------|------|
| お知らせ | `/news` |
| ゴミ収集 | `/garbage` |
| 防災情報 | `/disaster` |
| 活動紹介 | `/activities` |
| お問い合わせ | `/contact` |

モバイルではハンバーガーメニューまたは折りたたみ表示を使用します。

---

## 6. SEO設計

各ページで Next.js の `<Head>` コンポーネントを使い以下を設定します：

```tsx
<Head>
  <title>ページ名 | 笠間町内会</title>
  <meta name="description" content="ページの説明" />
  <meta property="og:title" content="ページ名 | 笠間町内会" />
  <meta property="og:description" content="ページの説明" />
  <meta property="og:type" content="website" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</Head>
```

---

## 7. ホスティング・デプロイ

| 選択肢 | 備考 |
|--------|------|
| Vercel（推奨） | Next.js との親和性が高く、無料プランで運用可能 |
| GitHub Pages | 静的エクスポート（`next export`）で利用可能 |

デプロイは `main` ブランチへのプッシュで自動デプロイ（CI/CD）を設定することを推奨します。
