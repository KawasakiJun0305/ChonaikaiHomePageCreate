import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Megaphone,
  CalendarDays,
  Trash2,
  ShieldAlert,
  Mail,
} from 'lucide-react';

const navItems = [
  { href: '/',           label: 'トップ',         Icon: Home },
  { href: '/news',       label: 'お知らせ',       Icon: Megaphone },
  { href: '/activities', label: '活動紹介',       Icon: CalendarDays },
  { href: '/garbage',    label: 'ゴミ収集',       Icon: Trash2 },
  { href: '/disaster',   label: '防災情報',       Icon: ShieldAlert },
  { href: '/contact',    label: 'お問い合わせ',   Icon: Mail },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-kasama-green shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors flex-shrink-0">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <div className="text-[10px] text-green-200 leading-none tracking-wide">横浜市栄区</div>
              <div className="text-base font-bold leading-snug">笠間町内会</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex gap-0.5" aria-label="メインナビゲーション">
            {navItems.map(({ href, label }) => {
              const isActive = router.pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-green-100 hover:bg-kasama-darkgreen hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden pb-3 border-t border-green-700 pt-2"
            aria-label="モバイルナビゲーション"
          >
            {navItems.map(({ href, label, Icon }) => {
              const isActive = router.pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-3 mx-1 rounded-lg text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-green-100 hover:bg-kasama-darkgreen hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
