import { GetServerSideProps } from 'next';
import AdminLayout from '../../../components/AdminLayout';
import { createServerSideClient } from '../../../lib/supabase-server';
import type { Database } from '../../../types/database';

type AuditLog = Database['public']['Tables']['audit_logs']['Row'] & {
  profiles?: { name: string } | null;
};
type Props = { logs: AuditLog[]; isAdmin: boolean };

const actionLabel: Record<string, { label: string; className: string }> = {
  create: { label: '作成', className: 'bg-green-100 text-green-700' },
  update: { label: '更新', className: 'bg-blue-100 text-blue-700' },
  delete: { label: '削除', className: 'bg-red-100 text-red-700' },
};

const tableLabel: Record<string, string> = {
  news: 'お知らせ',
  events: '行事',
  garbage_schedules: 'ゴミ収集',
  contact_submissions: 'お問い合わせ',
  profiles: '管理者',
};

export default function AdminLogs({ logs, isAdmin }: Props) {
  if (!isAdmin) {
    return (
      <AdminLayout title="操作ログ">
        <p className="text-gray-500">この機能は admin 権限のアカウントのみ利用できます。</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="操作ログ">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">日時</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">操作者</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">操作</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">対象</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {logs.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-gray-400">ログがありません</td></tr>
            ) : (
              logs.map((log) => {
                const ac = actionLabel[log.action] ?? { label: log.action, className: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('ja-JP')}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {log.profiles?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${ac.className}`}>
                        {ac.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {tableLabel[log.table_name] ?? log.table_name}
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

  const myProfile = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
  const isAdmin = myProfile.data?.role === 'admin';

  let logs: AuditLog[] = [];
  if (isAdmin) {
    const { data } = await supabase
      .from('audit_logs')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false })
      .limit(200);
    logs = (data ?? []) as unknown as AuditLog[];
  }

  return { props: { logs, isAdmin } };
};
