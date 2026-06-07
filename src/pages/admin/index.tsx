import { GetServerSideProps } from 'next';
import Link from 'next/link';
import AdminLayout from '../../components/AdminLayout';
import { createServerSideClient } from '../../lib/supabase-server';
import { Newspaper, Calendar, Trash2, MessageSquare, Users, ClipboardList } from 'lucide-react';

type Stats = {
  newsTotal: number;
  newsDraft: number;
  eventsTotal: number;
  contactUnread: number;
};

type Props = { stats: Stats; adminName: string };

export default function AdminDashboard({ stats, adminName }: Props) {
  const cards = [
    {
      href: '/admin/news',
      Icon: Newspaper,
      label: 'お知らせ',
      value: stats.newsTotal,
      sub: `下書き ${stats.newsDraft}件`,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      href: '/admin/events',
      Icon: Calendar,
      label: '行事予定',
      value: stats.eventsTotal,
      sub: '登録件数',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      href: '/admin/garbage',
      Icon: Trash2,
      label: 'ゴミ収集',
      value: null,
      sub: 'スケジュール管理',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      href: '/admin/contact',
      Icon: MessageSquare,
      label: 'お問い合わせ',
      value: stats.contactUnread,
      sub: '未読件数',
      color: stats.contactUnread > 0 ? 'text-red-600' : 'text-gray-500',
      bg: stats.contactUnread > 0 ? 'bg-red-50' : 'bg-gray-50',
    },
  ];

  return (
    <AdminLayout title="ダッシュボード">
      <p className="text-sm text-gray-500 mb-6">ようこそ、<strong>{adminName}</strong> さん</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(({ href, Icon, label, value, sub, color, bg }) => (
          <Link
            key={href}
            href={href}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            {value !== null ? (
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            ) : (
              <p className="text-base font-semibold text-gray-700">管理</p>
            )}
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/users"
          className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm">管理者アカウント管理</p>
            <p className="text-xs text-gray-400">役員のIDを追加・削除</p>
          </div>
        </Link>
        <Link
          href="/admin/logs"
          className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
        >
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm">操作ログ</p>
            <p className="text-xs text-gray-400">更新・削除の履歴を確認</p>
          </div>
        </Link>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createServerSideClient(req, res);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }

  const [newsRes, eventsRes, contactRes, profileRes] = await Promise.all([
    supabase.from('news').select('id, published'),
    supabase.from('events').select('id'),
    supabase.from('contact_submissions').select('id, status').eq('status', 'unread'),
    supabase.from('profiles').select('name').eq('id', session.user.id).single(),
  ]);

  const newsAll = newsRes.data ?? [];
  return {
    props: {
      stats: {
        newsTotal: newsAll.length,
        newsDraft: newsAll.filter((n) => !n.published).length,
        eventsTotal: eventsRes.data?.length ?? 0,
        contactUnread: contactRes.data?.length ?? 0,
      },
      adminName: profileRes.data?.name ?? session.user.email ?? '管理者',
    },
  };
};
