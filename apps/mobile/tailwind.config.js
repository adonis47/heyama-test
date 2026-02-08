/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fcf5fd',
          100: '#f7ebfa',
          200: '#efdef5',
          300: '#e2c2eb',
          400: '#d09cdb',
          500: '#b872c6',
          600: '#9d4ab3',
          700: '#753277',
          800: '#5e285f',
          900: '#4d234d',
          950: '#2e0e2e',
          DEFAULT: '#753277',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
