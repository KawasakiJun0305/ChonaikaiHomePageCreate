import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const siteLinks = [
  { href: '/',           label: 'トップページ' },
  { href: '/news',       label: 'お知らせ' },
  { href: '/activities', label: '活動紹介' },
  { href: '/garbage',    label: 'ゴミ収集情報' },
  { href: '/disaster',   label: '防災情報' },
  { href: '/contact',    label: 'お問い合わせ' },
  { href: '/privacy',    label: 'プライバシーポリシー' },
];

const externalLinks = [
  {
    href: 'https://www.city.yokohama.lg.jp/sakae/',
    label: '横浜市栄区役所',
  },
  {
    href: 'https://www.city.yokohama.lg.jp/kurashi/machizukuri-kankyo/gomi-recycle/',
    label: '横浜市ゴミ・リサイクル',
  },
  {
    href: 'https://www.city.yokohama.lg.jp/kurashi/bousai-kyukyu-bohan/bousai-saigai/',
    label: '横浜市防災情報',
  },
];

const YEAR = 2026;

export default function Footer() {
  return (
    <footer className="bg-kasama-darkgreen text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-base mb-3">笠間町内会</h3>
            <p className="text-green-200 text-sm leading-relaxed">
              横浜市栄区笠間にある町内会です。<br />
              地域の絆を大切に、住みよいまちづくりを進めています。
            </p>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3">サイトマップ</h3>
            <ul className="space-y-1.5 text-green-200 text-sm">
              {siteLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3">関連リンク</h3>
            <ul className="space-y-1.5 text-green-200 text-sm">
              {externalLinks.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors inline-flex items-center gap-1"
                  >
                    {label}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-8 pt-6 text-center text-green-400 text-xs">
          <p>© {YEAR} 横浜市栄区笠間町内会. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
