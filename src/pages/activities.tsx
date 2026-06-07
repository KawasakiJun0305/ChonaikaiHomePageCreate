import Head from 'next/head';
import Link from 'next/link';
import {
  Leaf,
  ShieldCheck,
  Sparkles,
  ShieldAlert,
  HeartHandshake,
  Flower2,
  Users,
} from 'lucide-react';
import { SITE_NAME } from '../lib/constants';

const activities = [
  {
    Icon: Leaf,
    title: '環境整備活動',
    desc: '地区内の公園・道路・側溝の清掃を年4回実施。きれいなまちを維持します。',
    color: 'text-green-600 bg-green-50',
  },
  {
    Icon: ShieldCheck,
    title: '防犯パトロール',
    desc: '月2回の夜間パトロールで地域の安全を守ります。反射材ベスト着用で活動中。',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    Icon: Sparkles,
    title: '夏祭り',
    desc: '毎年8月に笠間公園で開催。盆踊り・屋台・抽選会など地域の一大イベントです。',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    Icon: ShieldAlert,
    title: '防災訓練',
    desc: '年1回、避難訓練・消火訓練・応急処置を実施。いざというときの備えを確認します。',
    color: 'text-red-600 bg-red-50',
  },
  {
    Icon: HeartHandshake,
    title: '高齢者見守り',
    desc: '一人暮らしの高齢者への定期訪問・安否確認を行っています。',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    Icon: Flower2,
    title: '花壇整備',
    desc: '地区内の公共花壇を住民で管理。四季折々の花で街を彩ります。',
    color: 'text-pink-600 bg-pink-50',
  },
];

const annualEvents = [
  { month: '4月',  name: '定期総会・新入会員歓迎会' },
  { month: '5月',  name: '春の環境整備活動' },
  { month: '6月',  name: '梅雨期清掃活動' },
  { month: '7月',  name: '役員会・夏祭り準備' },
  { month: '8月',  name: '笠間夏祭り' },
  { month: '9月',  name: '防災訓練・防犯パトロール強化月間' },
  { month: '10月', name: '秋の環境整備活動・運動会' },
  { month: '11月', name: '文化祭・収穫祭' },
  { month: '12月', name: '年末清掃・防犯パトロール' },
  { month: '1月',  name: '新年会・新年パトロール' },
  { month: '2月',  name: '節分行事' },
  { month: '3月',  name: '年度末総括・次年度準備' },
];

const officers = [
  { role: '会長',    desc: '町内会全般の統括' },
  { role: '副会長',  desc: '会長補佐・各部調整' },
  { role: '会計',    desc: '会費・予算管理' },
  { role: '書記',    desc: '議事録・文書管理' },
  { role: '防犯部長', desc: '防犯パトロール統括' },
  { role: '環境部長', desc: '清掃・ゴミ収集管理' },
];

export default function Activities() {
  return (
    <>
      <Head>
        <title>{`活動紹介 | ${SITE_NAME}`}</title>
        <meta name="description" content="笠間町内会の年間行事・活動内容・役員紹介をご紹介します。" />
        <meta property="og:title" content={`活動紹介 | ${SITE_NAME}`} />
        <meta property="og:description" content="笠間町内会の年間行事・活動内容・役員紹介をご紹介します。" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1>活動紹介</h1>
          <p>笠間町内会の年間活動をご紹介します</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">

        {/* Main activities */}
        <section aria-labelledby="activities-heading">
          <h2 id="activities-heading" className="section-title">主な活動</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activities.map(({ Icon, title, desc, color }) => (
              <div key={title} className="card flex gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Annual calendar */}
        <section aria-labelledby="calendar-heading">
          <h2 id="calendar-heading" className="section-title">年間行事カレンダー</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {annualEvents.map((ev) => (
              <div
                key={ev.month}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:border-kasama-green hover:shadow-sm transition-all"
              >
                <div className="text-kasama-green font-bold text-lg mb-1">{ev.month}</div>
                <p className="text-sm text-gray-600 leading-snug">{ev.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Officers */}
        <section aria-labelledby="officers-heading">
          <h2 id="officers-heading" className="section-title">役員紹介（令和8年度）</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {officers.map((officer) => (
              <div key={officer.role} className="card flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-kasama-green" strokeWidth={1.75} />
                </div>
                <div>
                  <div className="font-bold text-kasama-green text-sm">{officer.role}</div>
                  <div className="text-gray-700 font-medium text-sm">掲載準備中</div>
                  <div className="text-xs text-gray-400 mt-0.5">{officer.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            ※ 個人情報保護のため、氏名は掲載しておりません。ご了承ください。
          </p>
        </section>

        {/* Join CTA */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 text-center border border-green-100">
          <h2 className="text-2xl font-bold text-kasama-green mb-3">
            町内会への参加・入会について
          </h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto mb-7 text-sm">
            笠間にお住まいの方はどなたでもご参加いただけます。
            地域のつながりを一緒に作りましょう。
          </p>
          <Link href="/contact" className="btn-primary">
            入会のお問い合わせ
          </Link>
        </section>
      </div>
    </>
  );
}
