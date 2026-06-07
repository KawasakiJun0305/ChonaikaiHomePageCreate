import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { createServerSideClient } from '../../../lib/supabase-server';
import { createClient } from '../../../lib/supabase';
import type { NewsCategory } from '../../../types/database';
import { CATEGORY_CONFIG } from '../../../lib/constants';

export default function AdminNewsNew() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState<NewsCategory>('news');
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    const { error: insertError } = await supabase.from('news').insert({
      title,
      body,
      category,
      published,
      published_at: published ? new Date().toISOString() : null,
      author_id: session?.user.id ?? null,
    });

    if (insertError) {
      setError('保存に失敗しました');
      setSaving(false);
      return;
    }

    router.push('/admin/news');
  };

  return (
    <AdminLayout title="お知らせ新規作成">
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="お知らせのタイトル"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              カテゴリ
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NewsCategory)}
              className="form-input"
            >
              {Object.entries(CATEGORY_CONFIG).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              本文 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="form-input resize-none"
              rows={10}
              placeholder="お知らせの内容を入力してください"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded text-kasama-green"
            />
            <label htmlFor="published" className="text-sm text-gray-700 font-semibold">
              すぐに公開する
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? '保存中...' : '保存する'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/news')}
            className="btn-outline"
          >
            キャンセル
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };
  return { props: {} };
};
