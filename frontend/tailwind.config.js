/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      colors: {
        kidney: {
          50:  '#fdf2f2',
          100: '#fde8e8',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          900: '#7f1d1d',
        }
      }
    },
  },
  plugins: [],
}
