import { GetServerSideProps } from 'next';
import { useState, FormEvent } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { createServerSideClient } from '../../../lib/supabase-server';
import { createClient } from '../../../lib/supabase';
import type { Database } from '../../../types/database';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

type GarbageRow = Database['public']['Tables']['garbage_schedules']['Row'];
type Props = { initialSchedules: GarbageRow[]; currentYear: number; currentMonth: number };

const GARBAGE_TYPES = ['燃えるゴミ', 'プラスチック', '缶・びん・ペットボトル', '不燃ゴミ', '古紙・古布'];

type FormState = {
  year: number;
  month: number;
  garbage_type: string;
  days: string;
  note: string;
};

export default function AdminGarbage({ initialSchedules, currentYear, currentMonth }: Props) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [filterYear, setFilterYear] = useState(currentYear);
  const [filterMonth, setFilterMonth] = useState(currentMonth);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    year: currentYear,
    month: currentMonth,
    garbage_type: GARBAGE_TYPES[0],
    days: '',
    note: '',
  });
  const [saving, setSaving] = useState(false);

  const filtered = schedules.filter(
    (s) => s.year === filterYear && s.month === filterMonth
  );

  const handleOpen = (s?: GarbageRow) => {
    if (s) {
      setEditingId(s.id);
      setForm({
        year: s.year,
        month: s.month,
        garbage_type: s.garbage_type,
        days: s.days.join(', '),
        note: s.note ?? '',
      });
    } else {
      setEditingId(null);
      setForm({ year: filterYear, month: filterMonth, garbage_type: GARBAGE_TYPES[0], days: '', note: '' });
    }
    setShowForm(true);
  };

  const handleClose = () => { setShowForm(false); setEditingId(null); };

  const parseDays = (val: string): number[] =>
    val.split(',').map((d) => parseInt(d.trim())).filter((d) => !isNaN(d) && d >= 1 && d <= 31);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const payload = {
      year: form.year,
      month: form.month,
      garbage_type: form.garbage_type,
      days: parseDays(form.days),
      note: form.note || null,
    };

    if (editingId) {
      const { data } = await supabase.from('garbage_schedules').update(payload).eq('id', editingId).select().single();
      if (data) setSchedules((prev) => prev.map((s) => (s.id === editingId ? data : s)));
    } else {
      const { data } = await supabase.from('garbage_schedules').insert(payload).select().single();
      if (data) setSchedules((prev) => [data, ...prev]);
    }
    setSaving(false);
    handleClose();
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm(`「${type}」の収集スケジュールを削除しますか？`)) return;
    const supabase = createClient();
    await supabase.from('garbage_schedules').delete().eq('id', id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <AdminLayout title="ゴミ収集スケジュール管理">
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(Number(e.target.value))}
          className="form-input w-auto"
        >
          {years.map((y) => <option key={y} value={y}>{y}年</option>)}
        </select>
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(Number(e.target.value))}
          className="form-input w-auto"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>{m}月</option>
          ))}
        </select>
        <button onClick={() => handleOpen()} className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2">
          <Plus className="w-4 h-4" />
          追加
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-kasama-green/30 p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-700">{editingId ? '編集' : '収集日を追加'}</h2>
            <button onClick={handleClose}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <select value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} className="form-input">
                {years.map((y) => <option key={y} value={y}>{y}年</option>)}
              </select>
              <select value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })} className="form-input">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>{m}月</option>
                ))}
              </select>
              <select value={form.garbage_type} onChange={(e) => setForm({ ...form, garbage_type: e.target.value })} className="form-input">
                {GARBAGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <input
              type="text"
              value={form.days}
              onChange={(e) => setForm({ ...form, days: e.target.value })}
              className="form-input"
              placeholder="収集日（カンマ区切り例: 3, 17, 24）"
              required
            />
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="form-input"
              placeholder="備考（任意）"
            />
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
              <th className="text-left px-4 py-3 font-semibold text-gray-600">種別</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">収集日</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">備考</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">この月のデータがありません</td></tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-gray-800">{s.garbage_type}</td>
                  <td className="px-4 py-3 text-gray-600">{s.days.join(', ')} 日</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{s.note ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => handleOpen(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-kasama-green hover:bg-green-50">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id, s.garbage_type)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
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

  const { data } = await supabase.from('garbage_schedules').select('*').order('year').order('month').order('garbage_type');
  const now = new Date();
  return {
    props: {
      initialSchedules: data ?? [],
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
    },
  };
};
