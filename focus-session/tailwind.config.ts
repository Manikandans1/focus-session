import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F6F5',
        canvasDim: '#EAEDEB',
        ink: '#10201D',
        inkSoft: '#3C4A47',
        muted: '#7C8C89',
        line: '#DBE2DF',
        primary: {
          DEFAULT: '#0F766E',
          dark: '#0B5A54',
          light: '#E4F2F0',
        },
        amber: {
          DEFAULT: '#F5A623',
          dark: '#C97F0F',
          light: '#FCEACB',
        },
        card: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16, 32, 29, 0.04), 0 8px 24px rgba(16, 32, 29, 0.06)',
        ring: '0 0 0 4px rgba(15, 118, 110, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
