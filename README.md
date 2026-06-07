# 笠間町内会 公式ホームページ

横浜市栄区笠間地区の自治組織「笠間町内会」の公式ウェブサイト。

## 概要

地域のお知らせ・ゴミ収集情報・防災情報・活動紹介・お問い合わせを提供する、町内会員および地域住民向けの情報サイトです。

## ページ構成

| パス | 説明 |
|------|------|
| `/` | トップページ（最新のお知らせ・直近の予定・緊急連絡先） |
| `/news` | お知らせ（カテゴリーフィルター付き一覧） |
| `/garbage` | ゴミ収集情報（収集日カレンダー・分別ガイド・粗大ゴミ） |
| `/disaster` | 防災情報（緊急連絡先・避難場所一覧・日頃からの備え） |
| `/activities` | 活動紹介（主な活動・年間行事カレンダー・役員紹介） |
| `/contact` | お問い合わせ（メーラー連携フォーム） |

## 技術スタック

| 分類 | 技術 |
|------|------|
| フレームワーク | Next.js 14（Pages Router） |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS 3 |
| アイコン | lucide-react |
| ランタイム | Node.js 18 以上 |

## セットアップ

```bash
npm install
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## コマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | 本番ビルド |
| `npm start` | 本番サーバー起動 |
| `npm run lint` | ESLint でコード品質チェック |
| `npm run type-check` | TypeScript 型チェック |
| `npm run format` | Prettier でフォーマット |
| `npm run format:check` | フォーマット状況チェック |

## ドキュメント

- [セットアップガイド](docs/SETUP.md)
- [開発ガイドライン](docs/DEVELOPMENT.md)
- [プロジェクト構造](docs/PROJECT_STRUCTURE.md)
- [要件定義](docs/requirements/)
