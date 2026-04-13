import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          700: '#1e293b',
          800: '#0f172a',
          900: '#0a0e1a',
          950: '#060912',
        },
        accent: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        success: {
          400: '#34d399',
          500: '#10b981',
        },
        danger: {
          400: '#f87171',
          500: '#ef4444',
        },
        warning: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(99, 102, 241, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
