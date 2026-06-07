import Head from 'next/head';
import {
  Phone,
  Siren,
  Building2,
  RadioTower,
  School,
  Backpack,
  Home,
  Users,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { SITE_NAME } from '../lib/constants';

const contacts = [
  { name: '警察（緊急）',   tel: '110',          href: 'tel:110',          Icon: Siren },
  { name: '消防・救急（緊急）', tel: '119',       href: 'tel:119',          Icon: Siren },
  { name: '栄区役所',       tel: '045-292-2101', href: 'tel:0452922101',   Icon: Building2 },
  { name: '栄消防署',       tel: '045-895-0119', href: 'tel:0458950119',   Icon: Siren },
  { name: '横浜市災害情報', tel: '0570-045-119', href: 'tel:0570045119',   Icon: RadioTower },
  { name: '笠間町内会長',   tel: '（回覧板参照）', href: '#',              Icon: Users },
];

const shelters = [
  {
    name: '笠間小学校',
    address: '横浜市栄区笠間4丁目',
    type: '指定避難所・指定緊急避難場所',
    note: '地震・風水害時の避難所',
  },
  {
    name: '笠間中学校',
    address: '横浜市栄区笠間3丁目',
    type: '指定避難所',
    note: '大規模災害時の広域避難所',
  },
  {
    name: '笠間公園',
    address: '横浜市栄区笠間2丁目',
    type: '指定緊急避難場所',
    note: '地震・火災時の一時集合場所',
  },
  {
    name: '笠間公民館',
    address: '横浜市栄区笠間2丁目',
    type: '指定避難所',
    note: '要配慮者優先',
  },
];

const preparedness = [
  {
    title: '非常持ち出し袋',
    Icon: Backpack,
    items: ['飲料水（3日分）', '食料（3日分）', '救急用品', '懐中電灯・電池', '携帯ラジオ', '現金（小銭）', '身分証明書のコピー', '常備薬・処方箋'],
  },
  {
    title: '家の中の安全対策',
    Icon: Home,
    items: ['家具の固定（転倒防止）', '食器棚・本棚の固定', 'ガラスの飛散防止フィルム', '玄関・廊下の整理整頓', '消火器の設置・点検'],
  },
  {
    title: '家族で話し合う',
    Icon: Users,
    items: ['避難場所の確認', '集合場所の決定', '連絡方法の確認', '安否確認方法（171）', '近所との声かけ'],
  },
];

const relatedLinks = [
  {
    href: 'https://www.city.yokohama.lg.jp/kurashi/bousai-kyukyu-bohan/bousai-saigai/hagm/',
    label: '横浜市ハザードマップポータルサイト',
    Icon: MapPin,
  },
  {
    href: 'https://www.city.yokohama.lg.jp/kurashi/bousai-kyukyu-bohan/bousai-saigai/',
    label: '横浜市防災情報ポータル',
    Icon: Building2,
  },
  {
    href: 'https://www.jma.go.jp/jp/warn/241_table.html',
    label: '気象庁 気象警報・注意報',
    Icon: RadioTower,
  },
  {
    href: 'tel:171',
    label: '災害用伝言ダイヤル：171',
    Icon: Phone,
  },
];

export default function Disaster() {
  return (
    <>
      <Head>
        <title>{`防災情報 | ${SITE_NAME}`}</title>
        <meta name="description" content="笠間地区の避難場所・緊急連絡先・防災対策情報をご案内します。" />
        <meta property="og:title" content={`防災情報 | ${SITE_NAME}`} />
        <meta property="og:description" content="笠間地区の避難場所・緊急連絡先・防災対策情報をご案内します。" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="bg-red-700 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold">防災情報</h1>
          <p className="text-red-200 mt-2 text-sm">避難場所・緊急連絡先・備えの確認</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">

        {/* Emergency contacts */}
        <section aria-labelledby="contacts-heading">
          <h2 id="contacts-heading" className="text-xl font-bold text-red-700 border-l-4 border-red-600 pl-3 mb-6">
            緊急連絡先
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {contacts.map(({ name, tel, href, Icon }) => (
              <div key={name} className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="w-6 h-6 text-red-400" strokeWidth={1.75} />
                </div>
                <p className="text-xs text-gray-500 mb-1 leading-tight">{name}</p>
                <a
                  href={href}
                  className="font-bold text-red-700 text-lg hover:underline tabular-nums leading-none"
                >
                  {tel}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Shelters */}
        <section aria-labelledby="shelters-heading">
          <h2 id="shelters-heading" className="section-title">避難場所一覧</h2>
          <div className="space-y-3">
            {shelters.map((shelter) => (
              <div key={shelter.name} className="card flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <School className="w-5 h-5 text-blue-500" strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{shelter.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{shelter.address}</p>
                  <span className="badge badge-important mt-1.5">{shelter.type}</span>
                  <p className="text-sm text-gray-500 mt-2">{shelter.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700 border border-blue-100 flex gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
            <p>
              正確な避難場所・ハザードマップは
              <a
                href="https://www.city.yokohama.lg.jp/kurashi/bousai-kyukyu-bohan/bousai-saigai/hagm/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold ml-1"
              >
                横浜市ハザードマップ
              </a>
              でご確認ください。
            </p>
          </div>
        </section>

        {/* Preparedness */}
        <section aria-labelledby="prep-heading">
          <h2 id="prep-heading" className="section-title">日頃からの備え</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {preparedness.map(({ title, Icon, items }) => (
              <div key={title} className="card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-orange-500" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="text-sm text-gray-500 flex gap-2">
                      <span className="text-kasama-green flex-shrink-0 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Related links */}
        <section aria-labelledby="links-heading">
          <h2 id="links-heading" className="section-title">関連リンク</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-kasama-green hover:shadow-sm transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-400 group-hover:text-kasama-green transition-colors" strokeWidth={1.75} />
                </div>
                <span className="text-sm text-gray-700 font-medium group-hover:text-kasama-green transition-colors">
                  {label}
                </span>
                {href.startsWith('http') && (
                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 ml-auto flex-shrink-0" />
                )}
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
