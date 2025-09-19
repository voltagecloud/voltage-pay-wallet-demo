import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#F5F7FF',
          subtle: '#F0F3FA',
        },
        border: {
          DEFAULT: '#E2E2E9',
          strong: '#1966FF',
          muted: '#D3D3D3',
          caution: '#FFBD00',
          danger: '#CC0000',
        },
        ink: {
          DEFAULT: '#000000',
          muted: '#404040',
          subtle: '#808080',
          placeholder: '#A4A4A4',
          inverse: '#FFFFFF',
        },
        brand: {
          DEFAULT: '#1966FF',
          soft: '#A8C0F0',
          focus: 'rgba(25, 102, 255, 0.24)',
        },
        success: {
          DEFAULT: '#0E954A',
        },
        warning: {
          DEFAULT: '#FFBD00',
          strong: '#997100',
        },
        danger: {
          DEFAULT: '#CC0000',
        },
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo'],
      },
      fontSize: {
        'display-2xl': ['6.25rem', { lineHeight: '1.2', fontWeight: '400' }],
        'display-xl': ['3rem', { lineHeight: '1.26', fontWeight: '400' }],
        'display-lg': ['2.25rem', { lineHeight: '1.26', fontWeight: '500' }],
        'display-md': ['1.5rem', { lineHeight: '1.26', fontWeight: '500' }],
        'body-xl': ['1.5rem', { lineHeight: '1.26', fontWeight: '400' }],
        'body-lg': ['1.25rem', { lineHeight: '1.26', fontWeight: '400' }],
        'body-lg-strong': ['1.25rem', { lineHeight: '1.26', fontWeight: '500' }],
        'body-md': ['1rem', { lineHeight: '1.26', fontWeight: '400' }],
        'body-md-strong': ['1rem', { lineHeight: '1.26', fontWeight: '500' }],
        'body-sm': ['0.875rem', { lineHeight: '1.3', fontWeight: '400' }],
        'mono-md': ['1rem', { lineHeight: '1.3', fontWeight: '400', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        pill: '9999px',
      },
      boxShadow: {
        card: '0 24px 60px -30px rgba(12, 20, 38, 0.25)',
        flyout: '0 24px 80px -32px rgba(12, 20, 38, 0.3)',
        focus: '0 0 0 4px rgba(25, 102, 255, 0.18)',
      },
      spacing: {
        4.5: '1.125rem',
        4.75: '1.1875rem',
      },
    },
  },
  plugins: [],
};

export default config;
