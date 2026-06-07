import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { createServerSideClient } from '../../../lib/supabase-server';
import { createClient } from '../../../lib/supabase';
import type { Database } from '../../../types/database';
import { CATEGORY_CONFIG } from '../../../lib/constants';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

type NewsRow = Database['public']['Tables']['news']['Row'];
type Props = { initialNews: NewsRow[] };

export default function AdminNews({ initialNews }: Props) {
  const [newsList, setNewsList] = useState(initialNews);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from('news').delete().eq('id', id);
    setNewsList((prev) => prev.filter((n) => n.id !== id));
    setDeleting(null);
  };

  const handleTogglePublish = async (item: NewsRow) => {
    const supabase = createClient();
    const updates = {
      published: !item.published,
      published_at: !item.published ? new Date().toISOString() : null,
    };
    const { data } = await supabase
      .from('news')
      .update(updates)
      .eq('id', item.id)
      .select()
      .single();
    if (data) setNewsList((prev) => prev.map((n) => (n.id === item.id ? data : n)));
  };

  return (
    <AdminLayout title="お知らせ管理">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{newsList.length}件</p>
        <Link href="/admin/news/new" className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2">
          <Plus className="w-4 h-4" />
          新規作成
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">タイトル</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">カテゴリ</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">公開日</th>
              <th className="text-center px-4 py-3 font-semibold text-gray-600">状態</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {newsList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  お知らせがありません
                </td>
              </tr>
            ) : (
              newsList.map((item) => {
                const cat = CATEGORY_CONFIG[item.category];
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cat.className}>{cat.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                      {item.published_at
                        ? new Date(item.published_at).toLocaleDateString('ja-JP')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleTogglePublish(item)}
                        title={item.published ? '非公開にする' : '公開する'}
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-semibold transition-colors ${
                          item.published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {item.published ? '公開中' : '下書き'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/news/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-kasama-green hover:bg-green-50 transition-colors"
                          title="編集"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deleting === item.id}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };

  const { data } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  return { props: { initialNews: data ?? [] } };
};
