import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          red: '#DC2626',
          'red-dark': '#B91C1C',
          'red-bright': '#EF4444',
          black: '#0A0C0E',
          dark: '#12151B',
          card: '#181C24',
          border: '#272D3B',
          muted: '#8E9BB0',
          silver: '#E2E8F0',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': 'radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15) 0%, rgba(10, 12, 14, 0.95) 70%)',
      },
    },
  },
  plugins: [],
};

export default config;
