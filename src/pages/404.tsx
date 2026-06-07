import Head from 'next/head';
import Link from 'next/link';
import { Home, Megaphone, Trash2, ShieldAlert, Mail } from 'lucide-react';
import { SITE_NAME } from '../lib/constants';

const links = [
  { href: '/',         Icon: Home,        label: 'トップページ' },
  { href: '/news',     Icon: Megaphone,   label: 'お知らせ' },
  { href: '/garbage',  Icon: Trash2,      label: 'ゴミ収集情報' },
  { href: '/disaster', Icon: ShieldAlert, label: '防災情報' },
  { href: '/contact',  Icon: Mail,        label: 'お問い合わせ' },
];

export default function NotFound() {
  return (
    <>
      <Head>
        <title>{`ページが見つかりません | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-8xl font-bold text-kasama-green opacity-20 leading-none select-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
          ページが見つかりません
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-sm">
          お探しのページは削除されたか、URLが変更された可能性があります。<br />
          以下のリンクからご利用ください。
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {links.map(({ href, Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-kasama-green hover:bg-green-50 transition-colors group"
            >
              <Icon className="w-6 h-6 text-gray-400 group-hover:text-kasama-green transition-colors" strokeWidth={1.75} />
              <span className="text-xs font-medium text-gray-600 group-hover:text-kasama-green transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>

        <Link href="/" className="btn-primary text-sm px-8">
          トップページへ戻る
        </Link>
      </div>
    </>
  );
}
