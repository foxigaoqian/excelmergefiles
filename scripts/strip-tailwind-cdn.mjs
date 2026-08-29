import fs from 'node:fs';
import path from 'node:path';

const generatedDirectories = [
  'merge-excel-files-keep-sheets',
  'merge-csv-files',
  'split-excel-by-rows',
  'excel-to-csv',
  'csv-to-excel',
  'json-to-excel',
];

const cdnTag = '<script src="https://cdn.tailwindcss.com"></script>';

for (const directory of generatedDirectories) {
  const file = path.resolve(directory, 'index.html');
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, html.replace(cdnTag, ''), 'utf8');
}

console.log('Removed Tailwind CDN from generated tool pages.');
