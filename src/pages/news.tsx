import Head from 'next/head';
import { useState } from 'react';
import { GetStaticProps } from 'next';
import { CATEGORY_CONFIG, SITE_NAME, type NewsCategory } from '../lib/constants';
import { createAdminClient } from '../lib/supabase-server';
import type { Database } from '../types/database';

type NewsRow = Database['public']['Tables']['news']['Row'];
type FilterKey = 'all' | NewsCategory;
type Props = { newsItems: NewsRow[] };

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'すべて' },
  { key: 'news',      label: 'お知らせ' },
  { key: 'event',     label: 'イベント' },
  { key: 'important', label: '重要' },
  { key: 'garbage',   label: 'ゴミ' },
];

export default function News({ newsItems }: Props) {
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
                <span className="ml-1.5 text-xs opacity-70">{countFor(key as NewsCategory)}</span>
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
              const dateStr = item.published_at
                ? new Date(item.published_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
                : '';
              return (
                <article key={item.id} className="card">
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <div className="flex items-center md:flex-col md:items-end gap-2 flex-shrink-0 md:w-28">
                      <time className="text-sm text-gray-400">{dateStr}</time>
                      <span className={cat.className}>{cat.label}</span>
                    </div>
                    <div className="flex-grow min-w-0 md:border-l md:border-gray-100 md:pl-5">
                      <h2 className="text-base font-bold text-gray-800 mb-2 leading-snug">{item.title}</h2>
                      <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{item.body}</p>
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

export const getStaticProps: GetStaticProps = async () => {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    return { props: { newsItems: data ?? [] }, revalidate: 60 };
  } catch {
    return { props: { newsItems: [] }, revalidate: 60 };
  }
};
