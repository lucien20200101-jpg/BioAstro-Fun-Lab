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
        surface: {
          base: '#050816',
          panel: '#0d1328',
          elevated: '#141f3f',
        },
        glass: {
          DEFAULT: 'rgba(13, 19, 40, 0.72)',
          strong: 'rgba(13, 19, 40, 0.84)',
          edge: 'rgba(143, 167, 255, 0.24)',
        },
        neon: {
          purple: '#8f6bff',
          blue: '#3aa7ff',
          mint: '#55f2c3',
        },
        bio: {
          primary: '#44d17f',
          deep: '#2ea661',
          soft: '#94ffbf',
        },
        astro: {
          primary: '#3aa7ff',
          deep: '#2b75ca',
          soft: '#a8d7ff',
        },
        bioastro: {
          primary: '#6bc9d6',
          accent: '#8f6bff',
          soft: '#b6f6f7',
        },
        admin: {
          danger: '#ff5f7a',
          warning: '#ffbf66',
          info: '#8ab5ff',
          disabled: '#7781a8',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(143,107,255,0.2), 0 8px 24px rgba(5,8,22,0.4)',
        neon: '0 0 0 1px rgba(143, 167, 255, 0.28), 0 0 24px rgba(143, 107, 255, 0.3)',
        panel: '0 10px 30px rgba(4, 5, 15, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        hud: '0 0 0 1px rgba(58, 167, 255, 0.3), 0 0 36px rgba(58, 167, 255, 0.22)',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' },
        },
        scanline: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 160px' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 0 1px rgba(143, 167, 255, 0.22), 0 0 18px rgba(143, 107, 255, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 0 1px rgba(143, 167, 255, 0.4), 0 0 28px rgba(143, 107, 255, 0.35)',
          },
        },
      },
      animation: {
        floatSlow: 'floatSlow 6s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
        pulseGlow: 'pulseGlow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
