/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://kasama-chonaikai.vercel.app',
  generateRobotsTxt: false,
  exclude: ['/login', '/admin', '/admin/*', '/api/*'],
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async () => [
    { loc: '/',           priority: 1.0, changefreq: 'daily' },
    { loc: '/news',       priority: 0.9, changefreq: 'daily' },
    { loc: '/activities', priority: 0.8, changefreq: 'weekly' },
    { loc: '/garbage',    priority: 0.8, changefreq: 'monthly' },
    { loc: '/disaster',   priority: 0.8, changefreq: 'monthly' },
    { loc: '/contact',    priority: 0.7, changefreq: 'yearly' },
    { loc: '/privacy',    priority: 0.3, changefreq: 'yearly' },
  ],
};
