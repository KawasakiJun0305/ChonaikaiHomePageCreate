import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return (
    <Html lang="ja">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta property="og:image" content={`${siteUrl}/ogp.png`} />
        <meta name="twitter:image" content={`${siteUrl}/ogp.png`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
