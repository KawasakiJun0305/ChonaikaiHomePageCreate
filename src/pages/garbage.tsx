import Head from 'next/head';
import Link from 'next/link';
import { Flame, Recycle, Package, FileText, AlertTriangle, MapPin, ExternalLink } from 'lucide-react';
import { SITE_NAME } from '../lib/constants';

const schedule = [
  {
    day: '月曜日',
    label: '燃やすゴミ',
    Icon: Flame,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconColor: 'text-orange-500',
  },
  {
    day: '火曜日',
    label: '缶・びん・ペットボトル',
    Icon: Recycle,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconColor: 'text-blue-500',
  },
  {
    day: '水曜日',
    label: '燃やすゴミ',
    Icon: Flame,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconColor: 'text-orange-500',
  },
  {
    day: '木曜日',
    label: 'プラスチック製容器包装',
    Icon: Package,
    color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    iconColor: 'text-yellow-500',
  },
  {
    day: '金曜日',
    label: '燃やすゴミ',
    Icon: Flame,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconColor: 'text-orange-500',
  },
  {
    day: '土曜日',
    label: '古紙・古布（第1・第3）',
    Icon: FileText,
    color: 'bg-green-50 border-green-200 text-green-700',
    iconColor: 'text-green-500',
  },
];

const separationGuide = [
  {
    category: '燃やすゴミ',
    Icon: Flame,
    headerColor: 'bg-orange-500',
    borderColor: 'border-orange-200',
    items: ['生ごみ（水を切って）', '紙類（リサイクルできないもの）', '革・ゴム製品', '汚れたプラスチック', '木くず・落ち葉'],
  },
  {
    category: '缶・びん・ペットボトル',
    Icon: Recycle,
    headerColor: 'bg-blue-500',
    borderColor: 'border-blue-200',
    items: ['スチール缶・アルミ缶（中を洗って）', 'ガラスびん（中を洗って）', 'ペットボトル（キャップ・ラベルを外して）'],
  },
  {
    category: 'プラスチック製容器包装',
    Icon: Package,
    headerColor: 'bg-yellow-500',
    borderColor: 'border-yellow-200',
    items: ['食品トレイ', '袋・レジ袋', 'ボトル類（シャンプー等）', 'カップ・パック類', '※汚れのひどいものは燃やすゴミへ'],
  },
  {
    category: '古紙・古布',
    Icon: FileText,
    headerColor: 'bg-green-500',
    borderColor: 'border-green-200',
    items: ['新聞紙・チラシ', 'ダンボール（ひもで束ねて）', '雑誌・本（ひもで束ねて）', '古布・古着（袋に入れて）'],
  },
];

export default function Garbage() {
  return (
    <>
      <Head>
        <title>{`ゴミ収集情報 | ${SITE_NAME}`}</title>
        <meta name="description" content="笠間地区のゴミ収集日程・分別方法をご案内します。" />
        <meta property="og:title" content={`ゴミ収集情報 | ${SITE_NAME}`} />
        <meta property="og:description" content="笠間地区のゴミ収集日程・分別方法をご案内します。" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1>ゴミ収集情報</h1>
          <p>笠間地区のゴミ収集日程・分別方法</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

        {/* Notice */}
        <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4" role="alert">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
          <div>
            <p className="font-semibold text-amber-800 text-sm">ご注意</p>
            <p className="text-amber-700 text-sm mt-0.5">
              収集は朝8:30までにゴミステーションへ出してください。前日夜からの持ち出しはご遠慮ください。
            </p>
          </div>
        </div>

        {/* Weekly schedule */}
        <section aria-labelledby="schedule-heading">
          <h2 id="schedule-heading" className="section-title">収集日カレンダー</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {schedule.map(({ day, label, Icon, color, iconColor }) => (
              <div key={day} className={`border rounded-xl p-4 ${color}`}>
                <p className="font-bold text-sm mb-2">{day}</p>
                <div className={`mb-1.5 ${iconColor}`}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <p className="text-xs leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Separation guide */}
        <section aria-labelledby="separation-heading">
          <h2 id="separation-heading" className="section-title">分別ガイド</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {separationGuide.map(({ category, Icon, headerColor, borderColor, items }) => (
              <div key={category} className={`rounded-xl overflow-hidden border ${borderColor}`}>
                <div className={`${headerColor} text-white px-4 py-3 flex items-center gap-2`}>
                  <Icon className="w-5 h-5" strokeWidth={1.75} />
                  <span className="font-bold text-sm">{category}</span>
                </div>
                <ul className="bg-white p-4 space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-gray-300 flex-shrink-0 mt-0.5">›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Large waste */}
        <section aria-labelledby="sodai-heading">
          <h2 id="sodai-heading" className="section-title">粗大ゴミの捨て方</h2>
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              {[
                { title: '事前予約が必要', body: '粗大ゴミは事前に横浜市に申込みが必要です。' },
                { title: '手数料がかかります', body: '品目により異なります。詳細は横浜市HPをご確認ください。' },
                { title: '収集日を指定', body: '申込後に指定された日時に指定場所へ出してください。' },
              ].map(({ title, body }) => (
                <div key={title}>
                  <p className="font-bold text-kasama-green mb-1">{title}</p>
                  <p className="text-gray-500">{body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <a
                href="https://www.city.yokohama.lg.jp/kurashi/machizukuri-kankyo/gomi-recycle/sodai/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm inline-flex items-center gap-1.5"
              >
                横浜市粗大ゴミ申込みページ
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Station info */}
        <section className="bg-green-50 rounded-xl p-6 flex gap-3 border border-green-100">
          <MapPin className="w-5 h-5 text-kasama-green flex-shrink-0 mt-0.5" strokeWidth={1.75} />
          <div>
            <h2 className="font-bold text-kasama-green text-base mb-1">ゴミステーションについて</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              各町丁目ごとにゴミステーションが設置されています。お住まいの地区のステーションをご利用ください。
              場所については町内会役員にお問い合わせいただくか、
              <Link href="/contact" className="text-kasama-green underline underline-offset-2">
                お問い合わせフォーム
              </Link>
              よりご確認ください。
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
