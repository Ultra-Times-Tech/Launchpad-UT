/** @type {import('tailwindcss').Config} */

export default {

  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      fontFamily: {
        avenir: ['Avenir', 'sans-serif'],
      },

      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
      },

      colors: {
        // danger: '#cd0037',
        // primary: '#0088ce',
        // success: '#0088ce',
        // info: '#0088ce',
        // warning: '#0088ce'
      },
    },
  },
  plugins: [],
}