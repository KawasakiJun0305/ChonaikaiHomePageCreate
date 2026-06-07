-- ========================================
-- 笠間町内会 ホームページ DB初期化
-- ========================================

-- profiles（管理者プロファイル）
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- news（お知らせ）
CREATE TABLE IF NOT EXISTS news (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  body         TEXT NOT NULL,
  category     TEXT NOT NULL CHECK (category IN ('event', 'news', 'important', 'garbage')),
  published    BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  author_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- events（行事・イベント）
CREATE TABLE IF NOT EXISTS events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  event_date  DATE NOT NULL,
  location    TEXT,
  published   BOOLEAN DEFAULT TRUE,
  author_id   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- garbage_schedules（ゴミ収集スケジュール）
CREATE TABLE IF NOT EXISTS garbage_schedules (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month        INT NOT NULL CHECK (month BETWEEN 1 AND 12),
  year         INT NOT NULL,
  garbage_type TEXT NOT NULL,
  days         INT[] NOT NULL,
  note         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (year, month, garbage_type)
);

-- contact_submissions（お問い合わせ）
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT NOT NULL,
  message    TEXT NOT NULL,
  status     TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- audit_logs（操作ログ）
CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action      TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  table_name  TEXT NOT NULL,
  record_id   UUID,
  diff        JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- updated_at 自動更新トリガー
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER garbage_updated_at
  BEFORE UPDATE ON garbage_schedules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- Row Level Security（RLS）
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE garbage_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- profiles: 本人のみ読み書き可、admin は全員閲覧
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- news: published は全員閲覧、下書きは認証済みのみ、編集は認証済みのみ
CREATE POLICY "news_select_published" ON news
  FOR SELECT USING (published = true);

CREATE POLICY "news_select_auth" ON news
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "news_insert_auth" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "news_update_auth" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "news_delete_admin" ON news
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- events: published は全員閲覧、編集は認証済みのみ
CREATE POLICY "events_select_published" ON events
  FOR SELECT USING (published = true);

CREATE POLICY "events_select_auth" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "events_insert_auth" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "events_update_auth" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "events_delete_admin" ON events
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- garbage_schedules: 全員閲覧、編集は認証済みのみ
CREATE POLICY "garbage_select_all" ON garbage_schedules
  FOR SELECT USING (true);

CREATE POLICY "garbage_insert_auth" ON garbage_schedules
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "garbage_update_auth" ON garbage_schedules
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "garbage_delete_admin" ON garbage_schedules
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- contact_submissions: 全員送信可、閲覧は認証済みのみ
CREATE POLICY "contact_insert_all" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_select_auth" ON contact_submissions
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "contact_update_auth" ON contact_submissions
  FOR UPDATE USING (auth.role() = 'authenticated');

-- audit_logs: admin のみ閲覧
CREATE POLICY "audit_select_admin" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "audit_insert_service" ON audit_logs
  FOR INSERT WITH CHECK (true);

-- ========================================
-- 新規ユーザー登録時に profiles を自動作成
-- ========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'editor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ========================================
-- サンプルデータ（初期投入用）
-- ※ 実際の管理者を招待後、このデータは削除してください
-- ========================================
INSERT INTO news (title, body, category, published, published_at) VALUES
  ('夏祭り2026 開催のお知らせ', '今年も笠間夏祭りを開催します。\n\n日時：2026年8月15日（土）17:00〜20:00\n場所：笠間公園\n内容：盆踊り・屋台・花火\n\n雨天の場合は翌日16日（日）に延期となります。', 'event', true, '2026-06-05'),
  ('6月の環境整備活動について', '6月21日（日）9:00〜 地区内の公園・道路の清掃を行います。', 'news', true, '2026-06-01'),
  ('防災訓練のご案内', '9月1日（火・防災の日）に栄区主催の防災訓練に参加します。', 'important', true, '2026-05-28')
ON CONFLICT DO NOTHING;

INSERT INTO events (title, description, event_date, location, published) VALUES
  ('夏祭り2026', '盆踊り・屋台・花火', '2026-08-15', '笠間公園', true),
  ('環境整備活動', '公園・道路の清掃', '2026-06-21', '笠間地区内', true),
  ('防災訓練', '避難訓練・消火器体験', '2026-09-01', '笠間公民館', true)
ON CONFLICT DO NOTHING;
