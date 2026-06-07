import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { createClient } from '../lib/supabase';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Trash2,
  MessageSquare,
  Users,
  ClipboardList,
  LogOut,
  ExternalLink,
} from 'lucide-react';

type Props = {
  children: ReactNode;
  title?: string;
};

const navItems = [
  { href: '/admin', label: 'ダッシュボード', Icon: LayoutDashboard, exact: true },
  { href: '/admin/news', label: 'お知らせ', Icon: Newspaper },
  { href: '/admin/events', label: '行事予定', Icon: Calendar },
  { href: '/admin/garbage', label: 'ゴミ収集', Icon: Trash2 },
  { href: '/admin/contact', label: 'お問い合わせ', Icon: MessageSquare },
  { href: '/admin/users', label: '管理者管理', Icon: Users },
  { href: '/admin/logs', label: '操作ログ', Icon: ClipboardList },
];

export default function AdminLayout({ children, title }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} | 管理画面` : '管理画面'} — 笠間町内会</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 flex">
        {/* サイドバー */}
        <aside className="w-56 bg-kasama-darkgreen text-white flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <p className="text-xs text-white/50 uppercase tracking-wider">笠間町内会</p>
            <p className="font-bold text-sm mt-0.5">管理ダッシュボード</p>
          </div>

          <nav className="flex-1 p-2 space-y-0.5">
            {navItems.map(({ href, label, Icon, exact }) => {
              const isActive = exact ? router.pathname === href : router.pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white font-semibold'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="p-2 border-t border-white/10 space-y-0.5">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              サイトを見る
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-5xl">
            {title && (
              <h1 className="text-xl font-bold text-gray-800 mb-6">{title}</h1>
            )}
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
