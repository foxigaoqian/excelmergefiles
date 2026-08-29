/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './scripts/**/*.{js,mjs}',
    './**/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
