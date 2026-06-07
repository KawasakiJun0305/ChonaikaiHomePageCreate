import Head from 'next/head';
import Link from 'next/link';
import {
  Megaphone,
  Trash2,
  ShieldAlert,
  CalendarDays,
  Mail,
  ChevronRight,
  Phone,
} from 'lucide-react';
import { CATEGORY_CONFIG, SITE_DESCRIPTION, SITE_NAME, type NewsCategory } from '../lib/constants';

const latestNews = [
  {
    id: 1,
    date: '2026年6月5日',
    category: 'event' as NewsCategory,
    title: '夏祭り2026 開催のお知らせ',
    summary: '今年も笠間夏祭りを開催します。日時：8月15日（土）17:00〜20:00、場所：笠間公園',
  },
  {
    id: 2,
    date: '2026年6月1日',
    category: 'news' as NewsCategory,
    title: '6月の環境整備活動について',
    summary: '6月21日（日）9:00〜 地区内の公園・道路の清掃を行います。参加をお願いします。',
  },
  {
    id: 3,
    date: '2026年5月28日',
    category: 'important' as NewsCategory,
    title: '防災訓練のご案内',
    summary: '9月1日（火）に防災訓練を実施します。地域全員の参加をお願いします。',
  },
];

const quickLinks = [
  { href: '/news',       Icon: Megaphone,    label: 'お知らせ',       desc: '行事・活動のご案内' },
  { href: '/garbage',    Icon: Trash2,        label: 'ゴミ収集',       desc: '収集日・分別方法' },
  { href: '/disaster',   Icon: ShieldAlert,   label: '防災情報',       desc: '避難場所・連絡先' },
  { href: '/activities', Icon: CalendarDays,  label: '活動紹介',       desc: '年間行事・役員' },
  { href: '/contact',    Icon: Mail,          label: 'お問い合わせ',   desc: 'ご意見・ご相談' },
];

const upcomingEvents = [
  { date: '6月21日', name: '環境整備活動' },
  { date: '7月10日', name: '役員会' },
  { date: '8月15日', name: '夏祭り' },
  { date: '9月1日',  name: '防災訓練' },
];

const emergencyContacts = [
  { label: '警察',     tel: '110',          href: 'tel:110' },
  { label: '消防・救急', tel: '119',        href: 'tel:119' },
  { label: '栄区役所', tel: '045-292-2101', href: 'tel:0452922101' },
];

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${SITE_NAME} | 横浜市栄区`}</title>
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${SITE_NAME} | 横浜市栄区`} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
      </Head>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-kasama-green via-kasama-green to-kasama-darkgreen text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 text-center">
          <p className="text-green-200 text-sm font-medium mb-3 tracking-widest">横浜市栄区</p>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">笠間町内会</h1>
          <p className="text-green-100 text-lg max-w-md mx-auto leading-relaxed mb-10">
            地域の絆を大切に、住みよいまちづくりを進めています。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/news"
              className="bg-white text-kasama-green font-bold px-7 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg shadow-black/10"
            >
              最新のお知らせ
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/60 text-white font-bold px-7 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="bg-white shadow-sm border-b border-gray-100" aria-label="クイックリンク">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
            {quickLinks.map(({ href, Icon, label, desc }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-green-50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 group-hover:bg-kasama-green flex items-center justify-center mb-2 transition-colors">
                  <Icon className="w-6 h-6 text-kasama-green group-hover:text-white transition-colors" strokeWidth={1.75} />
                </div>
                <span className="font-bold text-gray-800 group-hover:text-kasama-darkgreen text-sm">
                  {label}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">{desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Latest news */}
          <section className="lg:col-span-2" aria-labelledby="news-heading">
            <div className="flex items-center justify-between mb-5">
              <h2 id="news-heading" className="section-title !mb-0">最新のお知らせ</h2>
              <Link
                href="/news"
                className="text-kasama-green text-sm font-medium hover:underline flex items-center gap-1"
              >
                すべて見る <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {latestNews.map((item) => {
                const cat = CATEGORY_CONFIG[item.category];
                return (
                  <div key={item.id} className="card flex gap-4">
                    <div className="flex-shrink-0 text-right w-24">
                      <p className="text-xs text-gray-400">{item.date}</p>
                      <span className={`${cat.className} mt-1.5`}>{cat.label}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* About */}
            <div className="card">
              <h2 className="font-bold text-kasama-green text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-kasama-green rounded-full" aria-hidden="true" />
                笠間町内会について
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                笠間町内会は横浜市栄区笠間地区の自治組織です。
                地域の安全・安心・快適な生活環境を守るため、様々な活動を行っています。
              </p>
              <Link href="/activities" className="btn-outline text-sm mt-4">
                活動を見る
              </Link>
            </div>

            {/* Upcoming events */}
            <div className="card">
              <h2 className="font-bold text-kasama-green text-base mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-kasama-green rounded-full" aria-hidden="true" />
                直近の予定
              </h2>
              <ul className="space-y-2.5 text-sm">
                {upcomingEvents.map((ev) => (
                  <li key={ev.date} className="flex items-center gap-3">
                    <span className="text-kasama-green font-bold text-xs bg-green-50 px-2 py-1 rounded-md w-16 text-center flex-shrink-0">
                      {ev.date}
                    </span>
                    <span className="text-gray-700">{ev.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency contacts */}
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <h2 className="font-bold text-red-700 text-base mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                緊急連絡先
              </h2>
              <ul className="text-sm space-y-2">
                {emergencyContacts.map((c) => (
                  <li key={c.label} className="flex justify-between items-center">
                    <span className="text-gray-600">{c.label}</span>
                    <a href={c.href} className="font-bold text-red-700 hover:underline tabular-nums">
                      {c.tel}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
