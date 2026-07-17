import fs from 'node:fs';
import path from 'node:path';

const pages = [
  {
    directory: 'merge-excel-files-keep-sheets',
    title: 'Merge Excel Files and Keep Sheets in One Workbook',
    description: 'Combine Excel files into one workbook while keeping source worksheets separate. Processing runs in your browser with clear compatibility limits.',
    tool: 'merge',
    mode: 'keep-sheets',
    h1: 'Merge Excel Files and Keep Sheets',
    intro: 'Copy source worksheets into one output workbook where supported by the browser spreadsheet library.',
    note: 'Verify formulas, formatting, charts, macros, and workbook-level features after download.',
  },
  {
    directory: 'merge-csv-files',
    title: 'Merge CSV Files Online into One Excel Workbook',
    description: 'Merge multiple CSV files into one XLSX worksheet in your browser. Append rows, add source columns, and remove identical records.',
    tool: 'merge-csv',
    h1: 'Merge CSV Files Online',
    intro: 'Append records from multiple CSV files into one XLSX worksheet. The first row of each file is treated as column headers.',
    note: 'Different header names create separate columns. CSV files do not contain Excel formatting, formulas, charts, or multiple worksheets.',
  },
  {
    directory: 'split-excel-by-rows',
    title: 'Split Excel File by Rows Online',
    description: 'Split the first Excel worksheet into smaller XLSX files using a chosen number of data rows per file. Local browser processing.',
    tool: 'splitter',
    h1: 'Split Excel File by Rows',
    intro: 'Choose the number of data rows in each output file and split the first worksheet locally in your browser.',
    note: 'Only the first worksheet is processed. The output focuses on table data rather than advanced workbook features.',
  },
  {
    directory: 'excel-to-csv',
    title: 'Excel to CSV Converter Online – First Worksheet',
    description: 'Convert the first worksheet of an XLSX or XLS workbook to UTF-8 CSV in your browser. No spreadsheet file-content upload.',
    tool: 'excel-to-csv',
    h1: 'Excel to CSV Converter',
    intro: 'Export the first worksheet of an Excel workbook as one UTF-8 CSV file.',
    note: 'CSV cannot preserve workbook formatting, formulas, charts, images, comments, or multiple worksheets.',
  },
  {
    directory: 'csv-to-excel',
    title: 'CSV to Excel Converter Online',
    description: 'Convert one CSV file into a single-sheet XLSX workbook in your browser. No application-server file processing.',
    tool: 'csv-to-excel',
    h1: 'CSV to Excel Converter',
    intro: 'Turn a CSV text file into a simple single-sheet XLSX workbook.',
    note: 'Delimiter and text interpretation depend on the browser parser; custom formatting and formulas are not inferred.',
  },
  {
    directory: 'json-to-excel',
    title: 'JSON to Excel Converter Online',
    description: 'Convert a JSON array or object into an XLSX worksheet in your browser. Best for flat arrays of records.',
    tool: 'json-to-excel',
    h1: 'JSON to Excel Converter',
    intro: 'Convert a JSON array, or one JSON object, into a single Excel worksheet.',
    note: 'Flat records work best. Nested objects are not automatically normalized into relational tables.',
  },
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function render(page) {
  const canonical = `https://www.mergeexcelfiles.online/${page.directory}/`;
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: page.h1,
    url: canonical,
    description: page.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript and a modern browser',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  });
  const mode = page.mode ? ` data-merge-mode="${page.mode}"` : '';
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(page.title)}</title><meta name="description" content="${escapeHtml(page.description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${canonical}"><link rel="icon" href="/mergeexcelfiles.png" type="image/png"><meta name="theme-color" content="#0f172a"><meta property="og:type" content="website"><meta property="og:title" content="${escapeHtml(page.h1)}"><meta property="og:url" content="${canonical}"><meta property="og:description" content="${escapeHtml(page.description)}"><script src="https://cdn.tailwindcss.com"></script><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>body{font-family:'Plus Jakarta Sans',sans-serif}</style><script type="application/ld+json">${schema}</script></head>
<body><div id="root" data-tool="${page.tool}"${mode}><main style="max-width:900px;margin:80px auto;padding:24px"><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.intro)}</p><h2>Important output limits</h2><p>${escapeHtml(page.note)}</p></main></div><script type="module" src="/index.tsx"></script></body></html>`;
}

for (const page of pages) {
  const directory = path.resolve(page.directory);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), render(page), 'utf8');
}

console.log(`Generated ${pages.length} spreadsheet tool pages.`);
