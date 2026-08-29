/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './*.{js,ts,jsx,tsx}',
    './scripts/**/*.{js,mjs}',
    './contact/index.html',
    './privacy-policy/index.html',
    './terms/index.html',
    './merge-excel-files-keep-sheets/index.html',
    './merge-csv-files/index.html',
    './split-excel-by-rows/index.html',
    './excel-to-csv/index.html',
    './csv-to-excel/index.html',
    './json-to-excel/index.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
