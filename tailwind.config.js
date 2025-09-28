// File: tailwind.config.js

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
        sans: ['var(--font-inter)'],      // Mendefinisikan kelas 'font-sans'
        pixel: ['var(--font-pixel)'],   // Mendefinisikan kelas 'font-pixel'
      },
    },
  },
  plugins: [],
};