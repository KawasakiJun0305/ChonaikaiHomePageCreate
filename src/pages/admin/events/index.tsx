import { GetServerSideProps } from 'next';
import { useState, FormEvent } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { createServerSideClient } from '../../../lib/supabase-server';
import { createClient } from '../../../lib/supabase';
import type { Database } from '../../../types/database';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

type EventRow = Database['public']['Tables']['events']['Row'];
type Props = { initialEvents: EventRow[] };

type FormState = {
  title: string;
  description: string;
  event_date: string;
  location: string;
  published: boolean;
};

const emptyForm: FormState = { title: '', description: '', event_date: '', location: '', published: true };

export default function AdminEvents({ initialEvents }: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleOpen = (ev?: EventRow) => {
    if (ev) {
      setEditingId(ev.id);
      setForm({
        title: ev.title,
        description: ev.description ?? '',
        event_date: ev.event_date,
        location: ev.location ?? '',
        published: ev.published,
      });
    } else {
      setEditingId(null);
      setForm(emptyForm);
    }
    setShowForm(true);
  };

  const handleClose = () => { setShowForm(false); setEditingId(null); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    if (editingId) {
      const { data } = await supabase.from('events').update(form).eq('id', editingId).select().single();
      if (data) setEvents((prev) => prev.map((ev) => (ev.id === editingId ? data : ev)));
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      const { data } = await supabase
        .from('events')
        .insert({ ...form, author_id: session?.user.id ?? null })
        .select()
        .single();
      if (data) setEvents((prev) => [data, ...prev]);
    }
    setSaving(false);
    handleClose();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`「${title}」を削除しますか？`)) return;
    const supabase = createClient();
    await supabase.from('events').delete().eq('id', id);
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  return (
    <AdminLayout title="行事予定管理">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">{events.length}件</p>
        <button onClick={() => handleOpen()} className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2">
          <Plus className="w-4 h-4" />
          新規追加
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-kasama-green/30 p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-700">{editingId ? '行事を編集' : '行事を追加'}</h2>
            <button onClick={handleClose}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="form-input"
              placeholder="行事名 *"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="form-input"
                required
              />
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="form-input"
                placeholder="場所"
              />
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="form-input resize-none"
              rows={3}
              placeholder="詳細（任意）"
            />
            <div className="flex items-center gap-2">
              <input
                id="ev-published"
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="ev-published" className="text-sm text-gray-700">公開する</label>
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
                {saving ? '保存中...' : <><Check className="w-4 h-4 inline mr-1" />保存</>}
              </button>
              <button type="button" onClick={handleClose} className="btn-outline text-sm">キャンセル</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">行事名</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">開催日</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">場所</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {events.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">行事がありません</td></tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{ev.title}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(ev.event_date).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{ev.location ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => handleOpen(ev)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-kasama-green hover:bg-green-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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

  const { data } = await supabase.from('events').select('*').order('event_date', { ascending: false });
  return { props: { initialEvents: data ?? [] } };
};
