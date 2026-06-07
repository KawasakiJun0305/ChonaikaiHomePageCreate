import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState, FormEvent } from 'react';
import AdminLayout from '../../../../components/AdminLayout';
import { createServerSideClient } from '../../../../lib/supabase-server';
import { createClient } from '../../../../lib/supabase';
import type { NewsCategory, Database } from '../../../../types/database';
import { CATEGORY_CONFIG } from '../../../../lib/constants';

type NewsRow = Database['public']['Tables']['news']['Row'];
type Props = { news: NewsRow };

export default function AdminNewsEdit({ news }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(news.title);
  const [body, setBody] = useState(news.body);
  const [category, setCategory] = useState<NewsCategory>(news.category);
  const [published, setPublished] = useState(news.published);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const supabase = createClient();
    const wasUnpublished = !news.published && published;

    const { error: updateError } = await supabase
      .from('news')
      .update({
        title,
        body,
        category,
        published,
        published_at: wasUnpublished ? new Date().toISOString() : news.published_at,
      })
      .eq('id', news.id);

    if (updateError) {
      setError('保存に失敗しました');
      setSaving(false);
      return;
    }

    router.push('/admin/news');
  };

  return (
    <AdminLayout title="お知らせ編集">
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
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">カテゴリ</label>
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
              公開する
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? '保存中...' : '更新する'}
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

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };

  const id = params?.id as string;
  const { data, error } = await supabase.from('news').select('*').eq('id', id).single();

  if (error || !data) return { notFound: true };

  return { props: { news: data } };
};
