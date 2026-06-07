export type NewsCategory = 'event' | 'news' | 'important' | 'garbage';

export const CATEGORY_CONFIG: Record<NewsCategory, { label: string; className: string }> = {
  event:     { label: 'イベント', className: 'badge-event' },
  news:      { label: 'お知らせ', className: 'badge-news' },
  important: { label: '重要',     className: 'badge-important' },
  garbage:   { label: 'ゴミ',     className: 'badge-garbage' },
};

export const SITE_NAME = '笠間町内会';
export const SITE_DESCRIPTION =
  '横浜市栄区笠間町内会の公式ホームページ。地域のお知らせ、ゴミ収集情報、防災情報などをお届けします。';
