# 管理者CMS・データベース設計書

**プロジェクト名:** 笠間町内会 公式ホームページ
**作成日:** 2026-06-07
**対象フェーズ:** DB導入 / 管理者管理 / CMS機能実装

---

## 1. 概要・目的

### 現状の課題

| 課題 | 内容 |
|------|------|
| コンテンツ更新にコード変更が必要 | お知らせ・イベントが各ページの静的配列に直書き |
| 管理者が1人しかいられない | 単一パスワードのみで複数アカウント不可 |
| 問い合わせデータが消える | フォーム送信後のデータ保存先なし |
| 操作追跡ができない | 誰がいつ何を変更したか不明 |

### 解決方針

**Supabase（PostgreSQL）** を導入し、以下を実現する：

1. **複数管理者アカウント管理** — Supabase Auth で役員ごとにID/PW発行
2. **ブラウザからコンテンツ編集** — 管理ダッシュボード (`/admin/*`) でCRUD操作
3. **問い合わせデータ保存** — DB に永続化し管理画面で一覧閲覧
4. **操作ログ記録** — 誰がいつ何を変更したか追跡

---

## 2. アーキテクチャ変更

### 2.1 変更後の全体構成

```
ブラウザ（PC・スマホ）
    │
    │ HTTPS
    ▼
Vercel（Next.js SSR / ISR）
    │
    ├── 公開ページ（/ /news /garbage 等）
    │       └── Supabase から ISR でデータ取得（60秒キャッシュ）
    │
    └── 管理ページ（/admin/*）
            └── Supabase Auth で認証 + RLS で保護
                │
                ▼
          Supabase（PostgreSQL）
          ├── news（お知らせ）
          ├── events（行事・予定）
          ├── garbage_schedules（ゴミ収集）
          ├── contact_submissions（お問い合わせ）
          └── audit_logs（操作ログ）
```

### 2.2 レンダリング方式の変更

| ページ | 変更前 | 変更後 | 理由 |
|--------|--------|--------|------|
| 公開ページ（news等） | 静的配列 | ISR（60秒） | コンテンツをDBから取得しつつ高速表示 |
| 管理ページ（/admin/*） | なし（新規） | SSR + Supabase Auth | リアルタイム認証が必要 |
| 問い合わせフォーム | メール送信のみ | DB保存 + （任意）メール通知 | 履歴管理 |

---

## 3. データベース設計

### 3.1 テーブル一覧

| テーブル名 | 説明 |
|------------|------|
| `profiles` | 管理者プロファイル（Auth と連携） |
| `news` | お知らせ記事 |
| `events` | 行事・イベント予定 |
| `garbage_schedules` | ゴミ収集スケジュール |
| `contact_submissions` | お問い合わせ送信データ |
| `audit_logs` | 操作ログ |

---

### 3.2 テーブル定義

#### `profiles`（管理者プロファイル）

```sql
CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,             -- 表示名（例: 会長 山田 太郎）
  role        TEXT NOT NULL DEFAULT 'editor',  -- 'admin' | 'editor'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID | Supabase Auth の user.id と紐付け |
| name | TEXT | 管理者の表示名 |
| role | TEXT | `admin`（全権限）/ `editor`（投稿のみ） |

---

#### `news`（お知らせ）

```sql
CREATE TABLE news (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,            -- Markdown または HTML
  category     TEXT NOT NULL,            -- 'general' | 'event' | 'urgent' | 'garbage'
  published    BOOLEAN DEFAULT FALSE,    -- false = 下書き
  published_at TIMESTAMPTZ,             -- 公開日時
  author_id    UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

カテゴリ値:

| 値 | 表示 |
|----|------|
| `general` | 一般 |
| `event` | 行事 |
| `urgent` | 緊急 |
| `garbage` | ゴミ |

---

#### `events`（行事・予定）

```sql
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  event_date  DATE NOT NULL,
  location    TEXT,
  published   BOOLEAN DEFAULT TRUE,
  author_id   UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### `garbage_schedules`（ゴミ収集スケジュール）

```sql
CREATE TABLE garbage_schedules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month        INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year         INT NOT NULL,
  garbage_type TEXT NOT NULL,   -- '燃えるゴミ' | 'プラスチック' | '缶・びん' | '不燃ゴミ'
  days         INT[] NOT NULL,  -- 収集日（例: [3, 17]）
  note         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (year, month, garbage_type)
);
```

---

#### `contact_submissions`（お問い合わせ）

```sql
CREATE TABLE contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'unread',   -- 'unread' | 'read' | 'replied'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### `audit_logs`（操作ログ）

```sql
CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id),
  action      TEXT NOT NULL,    -- 'create' | 'update' | 'delete'
  table_name  TEXT NOT NULL,    -- 対象テーブル名
  record_id   UUID,             -- 操作対象のレコードID
  diff        JSONB,            -- 変更内容（変更前後）
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3.3 Row Level Security（RLS）設計

Supabase では RLS でアクセス制御する。

| テーブル | SELECT | INSERT | UPDATE | DELETE |
|----------|--------|--------|--------|--------|
| `news`（published=true） | 全員 | admin/editor | admin/editor | admin のみ |
| `news`（published=false） | admin/editor | admin/editor | admin/editor | admin のみ |
| `events` | 全員 | admin/editor | admin/editor | admin のみ |
| `garbage_schedules` | 全員 | admin/editor | admin/editor | admin のみ |
| `contact_submissions` | admin/editor | 全員 | admin/editor | admin のみ |
| `audit_logs` | admin のみ | システム自動 | 不可 | 不可 |

---

## 4. 管理ダッシュボード（画面設計）

### 4.1 URLマッピング

```
/admin                  → ダッシュボードトップ（ログインチェック）
/admin/login            → 管理者ログイン画面
/admin/news             → お知らせ一覧
/admin/news/new         → お知らせ新規作成
/admin/news/[id]/edit   → お知らせ編集
/admin/events           → 行事一覧・管理
/admin/garbage          → ゴミ収集スケジュール管理
/admin/contact          → お問い合わせ受信トレイ
/admin/users            → 管理者アカウント管理（admin権限のみ）
/admin/logs             → 操作ログ一覧（admin権限のみ）
```

### 4.2 主要画面イメージ

#### ダッシュボードトップ（/admin）

```
┌─────────────────────────────────────────────┐
│ 笠間町内会 管理ダッシュボード    [ログアウト] │
├─────────────────────────────────────────────┤
│ ■ お知らせ         未読問合せ: 3件          │
│ ■ 行事予定         下書き: 2件              │
├──────────┬──────────┬──────────┬────────────┤
│お知らせ  │ 行 事    │ゴミ収集  │お問い合わせ │
│  管理    │  管理    │  管理    │  受信BOX   │
└──────────┴──────────┴──────────┴────────────┘
```

#### お知らせ一覧（/admin/news）

```
┌─────────────────────────────────────────────┐
│ お知らせ管理           [+ 新規作成]          │
├─────┬──────────────────┬────────┬───────────┤
│ 状態 │ タイトル         │カテゴリ│ 公開日    │
├─────┼──────────────────┼────────┼───────────┤
│ 公開 │ 7月の行事予定    │ 行事   │ 2026/7/1  │
│ 下書 │ 夏祭りのお知らせ │ イベント│ -         │
└─────┴──────────────────┴────────┴───────────┘
```

---

## 5. API設計

### 5.1 管理者向けAPIルート（Next.js API Routes）

| エンドポイント | メソッド | 説明 | 認証 |
|---|---|---|---|
| `/api/admin/news` | GET | お知らせ一覧（下書き含む） | 必須 |
| `/api/admin/news` | POST | お知らせ新規作成 | 必須 |
| `/api/admin/news/[id]` | PUT | お知らせ更新 | 必須 |
| `/api/admin/news/[id]` | DELETE | お知らせ削除 | 必須(admin) |
| `/api/admin/events` | GET/POST/PUT/DELETE | 行事CRUD | 必須 |
| `/api/admin/garbage` | GET/POST/PUT/DELETE | ゴミ収集CRUD | 必須 |
| `/api/admin/contact` | GET | 問い合わせ一覧 | 必須 |
| `/api/admin/contact/[id]` | PUT | 既読・返信済み更新 | 必須 |
| `/api/admin/users` | GET/POST/DELETE | 管理者管理 | admin必須 |
| `/api/admin/logs` | GET | 操作ログ | admin必須 |

### 5.2 公開向けAPIルート

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/api/news` | GET | 公開済みお知らせ一覧 |
| `/api/events` | GET | 行事一覧 |
| `/api/garbage` | GET | ゴミ収集スケジュール |
| `/api/contact` | POST | お問い合わせ送信（DB保存） |

---

## 6. 認証フロー

### 6.1 現行 → 変更後

```
【現行】
/login → パスワード入力 → Cookie(site_auth=ok) → 全ページアクセス可

【変更後（公開ページ）】
パスワード保護は廃止 → 全ページ公開

【変更後（管理ページ）】
/admin/login → メール+パスワード → Supabase Auth JWT
→ /admin/* アクセス時 middleware でJWT検証
→ RLS でDB操作を role ベースで制御
```

### 6.2 ミドルウェア設計

```typescript
// src/middleware.ts（変更後）
// /admin/* へのアクセスに Supabase Session を要求
// /admin/login は除外
// 公開ページはすべてフリー（パスワード保護廃止）
```

---

## 7. 実装フェーズ計画

### Phase 1: 基盤（Supabase接続・認証）
- [ ] Supabase プロジェクト作成
- [ ] `@supabase/supabase-js` インストール
- [ ] 環境変数設定（SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY）
- [ ] テーブル作成（SQLマイグレーション）
- [ ] RLS ポリシー設定
- [ ] 管理者ログイン画面（/admin/login）
- [ ] ミドルウェア変更（Supabase Auth ベースに）

### Phase 2: お知らせ CMS
- [ ] /admin/news 一覧画面
- [ ] /admin/news/new 作成画面
- [ ] /admin/news/[id]/edit 編集画面
- [ ] 公開ページ(/news) を DB 取得に変更（ISR）

### Phase 3: 行事・ゴミ収集管理
- [ ] /admin/events 管理画面
- [ ] /admin/garbage 管理画面
- [ ] 公開ページを DB 取得に変更

### Phase 4: 問い合わせ・ログ
- [ ] /api/contact → DB保存に変更
- [ ] /admin/contact 受信トレイ
- [ ] 操作ログ自動記録（DB trigger または API側で挿入）
- [ ] /admin/logs 閲覧画面

### Phase 5: 管理者管理
- [ ] /admin/users 管理者追加・削除
- [ ] role（admin/editor）による権限制御

---

## 8. 技術スタック追加分

| 追加パッケージ | 用途 |
|---|---|
| `@supabase/supabase-js` | Supabase クライアント |
| `@supabase/ssr` | Next.js SSR との連携（Cookie管理） |

---

## 9. Supabase 無料枠の制限確認

| リソース | 無料枠 | 想定使用量 | 判定 |
|----------|--------|-----------|------|
| DB容量 | 500MB | < 10MB（テキストのみ） | ✅ 問題なし |
| Auth ユーザー数 | 50,000人 | < 10人（役員のみ） | ✅ 問題なし |
| API リクエスト | 500万/月 | < 1万/月 | ✅ 問題なし |
| ストレージ | 1GB | 画像なし（初期） | ✅ 問題なし |
| プロジェクト休眠 | 1週間未アクセスで休眠 | 定期アクセスあり | ⚠️ 要注意 |

> **注意:** Supabase 無料プランは7日間アクセスなしでプロジェクトが休眠状態になる。Vercel の cron job で定期的にヘルスチェックを行うことで回避可能。
