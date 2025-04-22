/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Police principale pour les titres
        cabin: ['Cabin', 'sans-serif'],
        // Police secondaire pour les corps de texte
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        // Couleur principale : Ultra Violet
        primary: {
          50: '#e6e0ff',
          100: '#ccb9ff',
          200: '#b391ff',
          300: '#996afe',
          400: '#8042fc',
          500: '#7A52D1', // Couleur principale
          600: '#6843b5',
          700: '#563798',
          800: '#442c7c',
          900: '#33205f',
          950: '#1f1443',
        },
        // Couleurs complémentaires
        secondary: {
          50: '#f0f4f8',
          100: '#e0e8f0',
          200: '#c7d2e0',
          300: '#aeb8c7',
          400: '#95a0ad',
          500: '#7B8794', // Gris
          600: '#616e7e',
          700: '#525b6b',
          800: '#3e4553',
          900: '#2b303a',
          950: '#171923',
        },
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Bleu clair
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Autres couleurs de la palette
        light: {
          50: '#fefcff',
          100: '#faf0ff',
          200: '#f3e0ff',
          300: '#e8ccff',
          400: '#ddb8ff',
          500: '#D1A2FF', // Violet clair
          600: '#b189e6',
          700: '#9677c7',
          800: '#7b64a9',
          900: '#614f8a',
          950: '#3d2e5a',
        },
        dark: {
          50: '#f5f7fa',
          100: '#eaeef2',
          200: '#d8dfe8',
          300: '#c1c9d9',
          400: '#a3a9be',
          500: '#868e96', // Gris foncé
          600: '#6b7279',
          700: '#555a5f',
          800: '#3e4145',
          900: '#27292d',
          950: '#121315',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-scrollbar')
  ],
}