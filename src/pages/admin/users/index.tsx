import { GetServerSideProps } from 'next';
import { useState, FormEvent } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { createServerSideClient } from '../../../lib/supabase-server';
import type { Database, AdminRole } from '../../../types/database';
import { UserPlus, Trash2, Shield, User } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Props = { profiles: Profile[]; isAdmin: boolean };

export default function AdminUsers({ profiles: initialProfiles, isAdmin }: Props) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<AdminRole>('editor');
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState('');

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    setInviting(true);
    setMessage('');

    const res = await fetch('/api/admin/users/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, name: inviteName, role: inviteRole }),
    });

    if (res.ok) {
      setMessage(`${inviteEmail} に招待メールを送りました`);
      setInviteEmail('');
      setInviteName('');
      const data = await res.json();
      if (data.profile) setProfiles((prev) => [...prev, data.profile]);
    } else {
      const err = await res.json();
      setMessage(`エラー: ${err.error}`);
    }
    setInviting(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`「${name}」を削除しますか？この操作は取り消せません。`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    if (res.ok) setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  if (!isAdmin) {
    return (
      <AdminLayout title="管理者管理">
        <p className="text-gray-500">この機能は admin 権限のアカウントのみ利用できます。</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="管理者アカウント管理">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 招待フォーム */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            新しい管理者を招待
          </h2>
          <form onSubmit={handleInvite} className="space-y-3">
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="form-input"
              placeholder="氏名（例: 山田 太郎）"
              required
            />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="form-input"
              placeholder="メールアドレス"
              required
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as AdminRole)}
              className="form-input"
            >
              <option value="editor">editor（投稿のみ）</option>
              <option value="admin">admin（全権限）</option>
            </select>
            {message && (
              <p className={`text-sm ${message.startsWith('エラー') ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </p>
            )}
            <button type="submit" disabled={inviting} className="btn-primary text-sm disabled:opacity-50">
              {inviting ? '招待中...' : '招待メールを送る'}
            </button>
          </form>
        </div>

        {/* アカウント一覧 */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-700 text-sm">登録済み管理者 ({profiles.length}名)</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {profiles.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-kasama-green/10 flex items-center justify-center">
                  {p.role === 'admin'
                    ? <Shield className="w-4 h-4 text-kasama-green" />
                    : <User className="w-4 h-4 text-gray-400" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{p.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    p.role === 'admin' ? 'bg-kasama-green/10 text-kasama-green' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {p.role}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { redirect: { destination: '/admin/login', permanent: false } };

  const [profilesRes, myProfileRes] = await Promise.all([
    supabase.from('profiles').select('*').order('created_at'),
    supabase.from('profiles').select('role').eq('id', session.user.id).single(),
  ]);

  return {
    props: {
      profiles: profilesRes.data ?? [],
      isAdmin: myProfileRes.data?.role === 'admin',
    },
  };
};
