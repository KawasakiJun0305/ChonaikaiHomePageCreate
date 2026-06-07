import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CONFIG = {
  siteName:   '笠間町内会',
  tagline:    '地域の絆を大切に',
  subTagline: '横浜市栄区 笠間地区',
  bgFrom:     '#1b4332',
  bgTo:       '#2d6a4f',
  textColor:  '#ffffff',
  subColor:   '#86efac',
  urlColor:   'rgba(255,255,255,0.55)',
};

// Google Fonts CSS API から woff URL を取得して ArrayBuffer を返す
async function fetchGoogleFont(family, weight) {
  try {
    // WOFF2 ではなく WOFF を返させるために古い UA を使用
    const css = await fetch(
      `https://fonts.googleapis.com/css?family=${encodeURIComponent(family)}:${weight}`,
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 11.0; Windows NT 6.1)' },
        signal: AbortSignal.timeout(10000),
      }
    ).then((r) => r.text());

    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
    if (!match) throw new Error('URL not found in CSS');

    const buf = await fetch(match[1], { signal: AbortSignal.timeout(15000) }).then((r) =>
      r.arrayBuffer()
    );
    console.log(`  Google Fonts から取得: ${family} weight=${weight}`);
    return buf;
  } catch (e) {
    console.warn(`  Google Fonts 取得失敗 (${e.message})`);
    return null;
  }
}

// Windows システムフォント（Meiryo）をフォールバックとして使用
function loadSystemFont() {
  const candidates = [
    'C:\\Windows\\Fonts\\meiryo.ttc',
    'C:\\Windows\\Fonts\\msgothic.ttc',
    'C:\\Windows\\Fonts\\YuGothR.ttc',
  ];
  for (const p of candidates) {
    try {
      const buf = readFileSync(p);
      console.log(`  システムフォント使用: ${p}`);
      return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    } catch {
      // 次を試す
    }
  }
  return null;
}

async function main() {
  console.log('フォントを準備中...');

  let fontRegular = await fetchGoogleFont('Noto Sans JP', 400);
  let fontBold    = await fetchGoogleFont('Noto Sans JP', 700);

  // Google Fonts が取得できなかった場合はシステムフォントを使用
  if (!fontRegular) fontRegular = loadSystemFont();
  if (!fontBold)    fontBold    = fontRegular; // Bold がなければ Regular で代替

  if (!fontRegular) {
    console.error('❌ フォントを取得できませんでした。オンライン環境で再実行してください。');
    process.exit(1);
  }

  const fonts = [
    { name: 'NotoSans', data: fontRegular, weight: 400, style: 'normal' },
    { name: 'NotoSans', data: fontBold,    weight: 700, style: 'normal' },
  ];

  console.log('SVG を生成中...');
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${CONFIG.bgFrom} 0%, ${CONFIG.bgTo} 100%)`,
          fontFamily: 'NotoSans, sans-serif',
          padding: '60px 80px',
          boxSizing: 'border-box',
          position: 'relative',
        },
        children: [
          // 装飾円（左下）
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: -60,
                left: -60,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
              },
              children: '',
            },
          },
          // 装飾円（右上）
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: -80,
                right: -80,
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
              },
              children: '',
            },
          },
          // アクセントライン
          {
            type: 'div',
            props: {
              style: {
                width: 64,
                height: 5,
                borderRadius: 3,
                background: CONFIG.subColor,
                marginBottom: 32,
              },
              children: '',
            },
          },
          // サイト名
          {
            type: 'div',
            props: {
              style: {
                fontSize: 80,
                fontWeight: 700,
                color: CONFIG.textColor,
                textAlign: 'center',
                lineHeight: 1.15,
                marginBottom: 20,
              },
              children: CONFIG.siteName,
            },
          },
          // キャッチコピー
          {
            type: 'div',
            props: {
              style: {
                fontSize: 34,
                fontWeight: 400,
                color: CONFIG.subColor,
                textAlign: 'center',
                lineHeight: 1.5,
                marginBottom: 12,
              },
              children: CONFIG.tagline,
            },
          },
          // サブテキスト
          {
            type: 'div',
            props: {
              style: {
                fontSize: 26,
                color: CONFIG.urlColor,
                textAlign: 'center',
              },
              children: CONFIG.subTagline,
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, fonts }
  );

  console.log('PNG に変換中...');
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const pngData = resvg.render();
  const png = pngData.asPng();

  const outputPath = join(__dirname, '../public/ogp.png');
  writeFileSync(outputPath, png);

  const kb = (png.byteLength / 1024).toFixed(1);
  console.log(`✓ OGP画像を生成しました: public/ogp.png (${kb} KB, 1200×630px)`);
}

main().catch((err) => {
  console.error('❌ 生成に失敗しました:', err.message);
  process.exit(1);
});
