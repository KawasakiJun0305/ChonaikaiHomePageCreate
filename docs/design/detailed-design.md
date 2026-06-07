# 詳細設計書

**プロジェクト名:** 笠間町内会 公式ホームページ
**作成日:** 2026-06-07
**最終更新日:** 2026-06-07

---

## 1. 型定義

### `src/lib/constants.ts`

```ts
export type NewsCategory = 'event' | 'news' | 'important' | 'garbage';

export const CATEGORY_CONFIG: Record<NewsCategory, { label: string; className: string }> = {
  event:     { label: 'イベント', className: 'badge-event' },
  news:      { label: 'お知らせ', className: 'badge-news' },
  important: { label: '重要',     className: 'badge-important' },
  garbage:   { label: 'ゴミ',     className: 'badge-garbage' },
};

export const SITE_NAME = '笠間町内会';
export const SITE_DESCRIPTION = '横浜市栄区笠間町内会の公式ホームページ。...';
```

---

## 2. ページ詳細設計

### 2.1 トップページ（`/`）

**主要データ構造:**

```ts
// 最新のお知らせ（3件表示）
const latestNews = {
  id: number;
  date: string;        // 例: '2026年6月5日'
  category: NewsCategory;
  title: string;
  summary: string;     // 2行表示（line-clamp-2）
}[]

// クイックリンク（5項目固定）
const quickLinks = {
  href: string;
  Icon: LucideIcon;
  label: string;
  desc: string;
}[]

// 直近の予定（サイドバー）
const upcomingEvents = { date: string; name: string }[]

// 緊急連絡先
const emergencyContacts = { label: string; tel: string; href: string }[]
```

**レイアウト:**

```
[ヒーローバナー（グリーングラデーション）]
[クイックリンク 2列(sp) / 5列(pc)]
[最新のお知らせ 2/3幅] + [サイドバー 1/3幅]
  - お知らせリスト               - 笠間町内会について
                                 - 直近の予定
                                 - 緊急連絡先（赤背景）
```

---

### 2.2 お知らせ（`/news`）

**主要データ構造:**

```ts
const newsItems = {
  id: number;
  date: string;
  category: NewsCategory;
  title: string;
  body: string;    // 改行を \n で表現（whitespace-pre-line で表示）
}[]
```

**フィルタロジック:**

```ts
type FilterKey = 'all' | NewsCategory;

const filtered = activeFilter === 'all'
  ? newsItems
  : newsItems.filter((item) => item.category === activeFilter);
```

**状態:** `useState<FilterKey>('all')` でフィルター状態を管理（クライアントサイド）

---

### 2.3 ゴミ収集情報（`/garbage`）

**主要データ構造:**

```ts
// 週次スケジュール
const schedule = {
  day: string;       // 例: '月曜日'
  label: string;     // 例: '燃やすゴミ'
  Icon: LucideIcon;
  color: string;     // Tailwind クラス
  iconColor: string;
}[]

// 分別ガイド
const separationGuide = {
  category: string;
  Icon: LucideIcon;
  headerColor: string;
  borderColor: string;
  items: string[];   // 分別対象品目リスト
}[]
```

**外部リンク:** 粗大ゴミ申込みは横浜市の公式ページへ外部リンク

---

### 2.4 防災情報（`/disaster`）

**主要データ構造:**

```ts
// 緊急連絡先
const contacts = {
  name: string;
  tel: string;
  href: string;   // 'tel:110' 等
  Icon: LucideIcon;
}[]

// 避難場所
const shelters = {
  name: string;
  address: string;
  type: string;    // 例: '指定避難所・指定緊急避難場所'
  note: string;    // 用途・備考
}[]

// 日頃からの備えチェックリスト
const preparedness = {
  title: string;
  Icon: LucideIcon;
  items: string[];
}[]
```

---

### 2.5 活動紹介（`/activities`）

**主要データ構造:**

```ts
// 主な活動（6種）
const activities = {
  Icon: LucideIcon;
  title: string;
  desc: string;
  color: string;   // アイコン背景色（Tailwind クラス）
}[]

// 年間行事
const annualEvents = { month: string; name: string }[]  // 12ヶ月分

// 役員
const officers = { role: string; desc: string }[]  // 氏名は非掲載
```

---

### 2.6 お問い合わせ（`/contact`）

**フォームデータ型:**

```ts
type FormData = {
  name: string;
  email: string;
  category: string;
  message: string;
};
```

**送信処理:**

```ts
const subject = encodeURIComponent(`【笠間町内会HP】${category}：${name}様より`);
const body = encodeURIComponent(`お名前：${name}\nメール：${email}\n種別：${category}\n\n内容：\n${message}`);
window.location.href = `mailto:kasama-chonaikai@example.com?subject=${subject}&body=${body}`;
```

メールアドレスを変更する場合は `src/pages/contact.tsx` の `mailto:` 部分を編集します。

**状態:** `useState<boolean>(false)` で送信完了フラグを管理

---

## 3. グローバル CSS クラス定義（`globals.css`）

```css
@layer components {
  .card {
    @apply bg-white rounded-2xl shadow-sm border border-gray-100 p-5;
  }

  .btn-primary {
    @apply inline-block bg-kasama-green text-white font-bold px-6 py-2.5 rounded-full
           hover:bg-kasama-darkgreen transition-colors;
  }

  .btn-outline {
    @apply inline-block border-2 border-kasama-green text-kasama-green font-bold px-6 py-2.5 rounded-full
           hover:bg-kasama-green hover:text-white transition-colors;
  }

  .section-title {
    @apply text-xl font-bold text-gray-800 border-l-4 border-kasama-green pl-3 mb-6;
  }

  .page-hero {
    @apply bg-kasama-green text-white py-10;
  }

  .form-input {
    @apply w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm
           focus:outline-none focus:ring-2 focus:ring-kasama-green/30 focus:border-kasama-green;
  }

  /* バッジ */
  .badge-event     { @apply inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700; }
  .badge-news      { @apply inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700; }
  .badge-important { @apply inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700; }
  .badge-garbage   { @apply inline-block text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700; }
}
```

---

## 4. コンテンツ更新手順

| 更新内容 | 編集ファイル | 編集箇所 |
|---------|------------|---------|
| トップの最新お知らせ | `src/pages/index.tsx` | `latestNews` 配列 |
| お知らせ全件 | `src/pages/news.tsx` | `newsItems` 配列 |
| 直近の予定 | `src/pages/index.tsx` | `upcomingEvents` 配列 |
| ゴミ収集スケジュール | `src/pages/garbage.tsx` | `schedule` 配列 |
| 避難場所 | `src/pages/disaster.tsx` | `shelters` 配列 |
| 年間行事カレンダー | `src/pages/activities.tsx` | `annualEvents` 配列 |
| 問い合わせ先メール | `src/pages/contact.tsx` | `mailto:` の宛先 |
