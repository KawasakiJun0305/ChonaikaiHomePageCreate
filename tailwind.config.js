/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        kasama: {
          green: '#2d6a4f',
          darkgreen: '#1b4332',
          blue: '#1565c0',
          lightblue: '#e3f2fd',
          gold: '#f9a825',
          cream: '#fafaf7',
        },
      },
      fontFamily: {
        sans: [
          'Noto Sans JP',
          'Yu Gothic',
          '游ゴシック',
          'Meiryo',
          'メイリオ',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
