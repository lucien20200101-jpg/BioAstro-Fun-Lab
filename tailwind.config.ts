import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          bg: '#050816',
          panel: '#0d1328',
          bioGreen: '#44d17f',
          bioBlue: '#3aa7ff',
          nebulaPurple: '#8f6bff',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(143,107,255,0.2), 0 8px 24px rgba(5,8,22,0.4)',
      },
    },
  },
  plugins: [],
} satisfies Config;
