import fs from 'node:fs';
import path from 'node:path';

const pages = [
  {directory:'merge-excel-files-keep-sheets',title:'Merge Excel Files and Keep Sheets in One Workbook',description:'Combine Excel files into one workbook while keeping source worksheets separate. Learn the workflow, compatibility limits, and output checks.',tool:'merge',mode:'keep-sheets',h1:'Merge Excel Files and Keep Sheets',intro:'Copy source worksheets into one output workbook where supported by the browser spreadsheet library.',note:'Verify formulas, formatting, charts, macros, and workbook-level features after download.'},
  {directory:'merge-csv-files',title:'Merge CSV Files Online into One Excel Workbook',description:'Merge multiple CSV files into one XLSX worksheet. Learn how headers, UTF-8 text, duplicate rows, and different columns are handled.',tool:'merge-csv',h1:'Merge CSV Files Online',intro:'Append records from multiple CSV files into one XLSX worksheet.',note:'Different header names create separate columns. Standard comma-separated UTF-8 files are the most reliable input.'},
  {directory:'split-excel-by-rows',title:'Split Excel File by Rows Online',description:'Split the first Excel worksheet into smaller XLSX files by a chosen row count, with repeated headers and clear output limits.',tool:'splitter',h1:'Split Excel File by Rows',intro:'Choose the number of data rows in each output file and split the first worksheet locally.',note:'Only the first worksheet is processed and advanced workbook features may not be preserved.'},
  {directory:'excel-to-csv',title:'Excel to CSV Converter Online – First Worksheet',description:'Convert the first Excel worksheet to UTF-8 CSV and understand what happens to formulas, formatting, dates, and other worksheets.',tool:'excel-to-csv',h1:'Excel to CSV Converter',intro:'Export the first worksheet of an Excel workbook as one UTF-8 CSV file.',note:'CSV cannot preserve workbook formatting, formulas, charts, images, comments, or multiple worksheets.'},
  {directory:'csv-to-excel',title:'CSV to Excel Converter Online',description:'Convert one CSV file into a single-sheet XLSX workbook, with guidance for delimiters, encoding, dates, and leading zeros.',tool:'csv-to-excel',h1:'CSV to Excel Converter',intro:'Turn a CSV text file into a simple single-sheet XLSX workbook.',note:'Delimiter and text interpretation depend on the browser parser; custom formatting and formulas are not inferred.'},
  {directory:'json-to-excel',title:'JSON to Excel Converter Online',description:'Convert a JSON array or object into one XLSX worksheet. Best for flat records, with guidance for nested data and invalid JSON.',tool:'json-to-excel',h1:'JSON to Excel Converter',intro:'Convert a JSON array, or one JSON object, into a single Excel worksheet.',note:'Flat records work best. Nested objects are not automatically normalized into relational tables.'}
];

const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

function render(p){
 const canonical=`https://www.mergeexcelfiles.online/${p.directory}/`;
 const faq=[
  ['Are files uploaded to an application server?','Spreadsheet contents are processed in the current browser tab.'],
  ['What should I check after download?',p.note],
  ['Can I use this on a phone?','The interface works in modern mobile browsers, but large files may exceed device memory.'],
  ['Should I keep the original file?','Yes. Keep a backup and verify generated output before relying on it.']
 ];
 const schema={"@context":"https://schema.org","@type":"WebApplication",name:p.h1,url:canonical,description:p.description,applicationCategory:'BusinessApplication',operatingSystem:'Any',isAccessibleForFree:true};
 const faqSchema={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faq.map(([q,a])=>({"@type":"Question",name:q,acceptedAnswer:{"@type":"Answer",text:a}}))};
 const mode=p.mode?` data-merge-mode="${p.mode}"`:'';
 return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(p.title)}</title><meta name="description" content="${esc(p.description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(p.h1)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${canonical}"><script type="application/ld+json">${JSON.stringify(schema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script><script src="https://cdn.tailwindcss.com"></script></head><body><div id="root" data-tool="${p.tool}"${mode}><main style="max-width:900px;margin:64px auto;padding:24px"><h1>${esc(p.h1)}</h1><p>${esc(p.description)}</p><h2>How to use this tool</h2><ol><li>Select the supported file or files.</li><li>Review the available options.</li><li>Run the tool and download the result.</li><li>Open the output and verify important data.</li></ol><h2>What this tool does</h2><p>${esc(p.intro)}</p><h2>Important output limits</h2><p>${esc(p.note)}</p><h2>Frequently asked questions</h2>${faq.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</main></div><script type="module" src="/index.tsx"></script></body></html>`;
}
for(const p of pages){fs.mkdirSync(path.resolve(p.directory),{recursive:true});fs.writeFileSync(path.join(p.directory,'index.html'),render(p),'utf8');}
console.log(`Generated ${pages.length} substantial spreadsheet pages.`);
