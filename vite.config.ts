import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        keepSheets: resolve(__dirname, 'merge-excel-files-keep-sheets/index.html'),
        mergeCsv: resolve(__dirname, 'merge-csv-files/index.html'),
        splitExcel: resolve(__dirname, 'split-excel-by-rows/index.html'),
        excelToCsv: resolve(__dirname, 'excel-to-csv/index.html'),
        csvToExcel: resolve(__dirname, 'csv-to-excel/index.html'),
        jsonToExcel: resolve(__dirname, 'json-to-excel/index.html'),
        privacy: resolve(__dirname, 'privacy-policy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
