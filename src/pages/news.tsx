import Head from 'next/head';
import { useState } from 'react';
import { CATEGORY_CONFIG, SITE_NAME, type NewsCategory } from '../lib/constants';

type FilterKey = 'all' | NewsCategory;

const newsItems = [
  {
    id: 1,
    date: '2026年6月5日',
    category: 'event' as NewsCategory,
    title: '夏祭り2026 開催のお知らせ',
    body: '今年も笠間夏祭りを開催します。\n\n日時：2026年8月15日（土）17:00〜20:00\n場所：笠間公園\n内容：盆踊り・屋台・花火\n\n雨天の場合は翌日16日（日）に延期となります。多くの皆さまのご参加をお待ちしています。',
  },
  {
    id: 2,
    date: '2026年6月1日',
    category: 'news' as NewsCategory,
    title: '6月の環境整備活動について',
    body: '6月21日（日）9:00〜 地区内の公園・道路の清掃を行います。\n\n軍手・ゴミ袋はこちらで用意します。動きやすい服装でお越しください。小雨決行です。',
  },
  {
    id: 3,
    date: '2026年5月28日',
    category: 'important' as NewsCategory,
    title: '防災訓練のご案内',
    body: '9月1日（火・防災の日）に栄区主催の防災訓練に参加します。\n\n集合：笠間公民館 8:45\n内容：避難訓練・消火器体験・応急処置講習\n\n地域全員の参加をお願いします。',
  },
  {
    id: 4,
    date: '2026年5月15日',
    category: 'news' as NewsCategory,
    title: '令和8年度 町内会総会の結果報告',
    body: '5月10日（日）に開催した令和8年度定期総会の結果をご報告します。\n\n・令和7年度事業報告・決算報告：承認\n・令和8年度事業計画・予算：承認\n・役員改選：新役員が承認されました\n\n詳細は回覧板をご確認ください。',
  },
  {
    id: 5,
    date: '2026年4月20日',
    category: 'event' as NewsCategory,
    title: '新入会員歓迎会について',
    body: '今年度の新入会員歓迎会を開催します。\n\n日時：5月24日（日）11:00〜13:00\n場所：笠間公民館 大会議室\n\n当日は軽食をご用意します。新しく笠間にお越しの方はぜひご参加ください。',
  },
  {
    id: 6,
    date: '2026年4月1日',
    category: 'garbage' as NewsCategory,
    title: '4月からのゴミ収集日変更について',
    body: '横浜市の収集スケジュール変更に伴い、一部の収集曜日が変更になりました。\n\n変更内容の詳細はゴミ収集ページをご確認ください。',
  },
];

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'すべて' },
  { key: 'news',      label: 'お知らせ' },
  { key: 'event',     label: 'イベント' },
  { key: 'important', label: '重要' },
  { key: 'garbage',   label: 'ゴミ' },
];

export default function News() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered =
    activeFilter === 'all'
      ? newsItems
      : newsItems.filter((item) => item.category === activeFilter);

  const countFor = (key: NewsCategory) => newsItems.filter((i) => i.category === key).length;

  return (
    <>
      <Head>
        <title>{`お知らせ | ${SITE_NAME}`}</title>
        <meta name="description" content="笠間町内会からのお知らせ・イベント情報をお届けします。" />
        <meta property="og:title" content={`お知らせ | ${SITE_NAME}`} />
        <meta property="og:description" content="笠間町内会からのお知らせ・イベント情報をお届けします。" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="page-hero">
        <div className="page-hero-inner">
          <h1>お知らせ</h1>
          <p>地域のイベント・活動情報をお届けします</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap" role="tablist" aria-label="カテゴリーフィルター">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeFilter === key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeFilter === key
                  ? 'bg-kasama-green text-white shadow-sm'
                  : 'border border-kasama-green/60 text-kasama-green hover:bg-kasama-green hover:text-white'
              }`}
            >
              {label}
              {key !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  {countFor(key as NewsCategory)}
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-20">該当するお知らせがありません</p>
        ) : (
          <div className="space-y-4" role="tabpanel">
            {filtered.map((item) => {
              const cat = CATEGORY_CONFIG[item.category];
              return (
                <article key={item.id} className="card">
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <div className="flex items-center md:flex-col md:items-end gap-2 flex-shrink-0 md:w-28">
                      <time className="text-sm text-gray-400" dateTime={item.date}>
                        {item.date}
                      </time>
                      <span className={cat.className}>{cat.label}</span>
                    </div>
                    <div className="flex-grow min-w-0 md:border-l md:border-gray-100 md:pl-5">
                      <h2 className="text-base font-bold text-gray-800 mb-2 leading-snug">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
