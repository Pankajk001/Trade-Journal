export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#000000', // Pure black background
          800: '#121212', // Very dark gray for panels/cards
          700: '#262626', // Borders
          600: '#404040',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f5f5',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        green: {
          400: '#0ca88d',
          500: '#089981',
          600: '#067a67',
        },
        red: {
          400: '#f7525f',
          500: '#f23645',
          600: '#d92b3a',
        }
      }
    },
  },
  plugins: [],
}
