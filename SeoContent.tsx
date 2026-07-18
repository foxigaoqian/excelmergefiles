import React from 'react';
import { MergeMode, ToolType } from './types';

type Page = { how: string[]; uses: string[]; example: string; issues: string[]; faq: [string,string][] };

const PAGES: Record<ToolType, Page> = {
  merge: {
    how: ['Select two or more XLSX, XLS, or CSV files.','Choose Append Rows for similar tables or Keep Sheets for separate worksheets.','Arrange the files in processing order.','Configure source columns and identical-row removal.','Merge, download, and verify the workbook in Excel.'],
    uses: ['Combine monthly sales or expense reports.','Consolidate inventory exports from several locations.','Append survey or CRM exports with matching headers.','Keep unrelated reports as separate tabs in one workbook.'],
    example: 'January.xlsx and February.xlsx with Date, Order ID, and Revenue columns become one table in Append Rows mode. Keep Sheets instead creates separate January and February tabs.',
    issues: ['Columns do not line up: standardize header names before merging.','Dates look different: verify serial dates, text dates, and regional formats.','Blank output: protected, encrypted, or connection-based files may not be readable.','Slow browser: process fewer or smaller files when device memory is limited.'],
    faq: [['Can files have different columns?','Yes. Different headers become separate output columns.'],['Can I combine XLS and XLSX?','Yes, within the features supported by the browser spreadsheet library.'],['Are formulas and formatting preserved?','Append Rows focuses on table data. Keep Sheets may retain some features, but formulas, charts, macros, styling, and links must be checked.'],['Are files uploaded?','Spreadsheet contents are processed in the browser tab and are not sent to an application processing server.'],['How many files can I merge?','There is no fixed count, but browser memory and file complexity create practical limits.'],['Can I remove duplicates?','The tool removes only rows that are completely identical across all output columns.']],
  },
  'merge-csv': {
    how: ['Select at least two CSV files.','Confirm the first row contains headers.','Choose source columns and identical-row removal.','Merge and download the XLSX result.','Verify delimiters, accents, dates, and columns.'],
    uses: ['Combine recurring exports from analytics or CRM systems.','Append similarly structured log files.','Merge contact lists while retaining source-file columns.'],
    example: 'Two CSV files with Email, Name, and Country become one Excel worksheet. An extra Phone header creates an additional column.',
    issues: ['One output column: re-export as standard comma-separated UTF-8 CSV.','Broken accents: save the source as UTF-8.','Repeated headers: remove header rows embedded inside the data.'],
    faq: [['Can CSV files have different columns?','Yes. Different headers create separate output columns.'],['Does CSV preserve Excel formatting?','No. CSV contains plain table text only.'],['What is downloaded?','One XLSX workbook with a merged worksheet.'],['Can it read semicolon-separated files?','Parser behavior varies; standard comma-separated UTF-8 input is most reliable.']],
  },
  splitter: {
    how: ['Select one XLSX or XLS workbook.','Enter rows per output file.','Start the split.','Download each generated part.','Check headers and row ranges.'],
    uses: ['Meet upload row limits.','Create predictable batches.','Distribute smaller lists to separate reviewers.'],
    example: 'A first worksheet with 10,000 data rows split at 1,000 rows creates 10 files, each repeating the header row.',
    issues: ['Only the first worksheet is processed.','Generated parts focus on table data, not advanced workbook features.','The first row is treated as a repeated header.'],
    faq: [['Does each part include headers?','Yes, the first row is repeated.'],['Can every worksheet be split?','No, the current version processes the first worksheet.'],['Can it split by a column value?','No, it splits by a fixed number of rows.'],['Is processing local?','Yes, it runs in the browser tab.']],
  },
  'excel-to-csv': {
    how: ['Select one XLSX or XLS workbook.','Put the required table in the first worksheet.','Convert the workbook.','Download the UTF-8 CSV.','Verify text, dates, and formula values.'],
    uses: ['Prepare database imports.','Create flat files for scripts.','Move table data to CSV-only systems.'],
    example: 'A first sheet with Product, SKU, and Price becomes one UTF-8 CSV containing those table values.',
    issues: ['Only the first worksheet is exported.','CSV cannot store fonts, colors, charts, or images.','The converter uses formula values available to the parser and does not recalculate Excel.'],
    faq: [['Which sheet is converted?','Only the first worksheet.'],['Are formulas preserved?','CSV stores available values, not workbook formulas.'],['Is output UTF-8?','Yes.'],['Can CSV contain several tabs?','No, CSV is one flat table.']],
  },
  'csv-to-excel': {
    how: ['Select one CSV file.','Convert it to XLSX.','Download the workbook.','Open it in Excel.','Verify delimiters, columns, encoding, and dates.'],
    uses: ['Review CSV records in Excel.','Share data as XLSX.','Apply spreadsheet formatting after conversion.'],
    example: 'A CSV with Name, Email, and Status becomes one XLSX workbook with a single worksheet.',
    issues: ['One column: use a standard comma delimiter.','Leading zeros: format identifier columns as text.','Changed dates: interpretation depends on source text and locale.'],
    faq: [['Does it add formulas or styling?','No, it creates a simple worksheet.'],['Can I convert many CSV files?','Use the Merge CSV Files page.'],['How many sheets are created?','One.'],['Is the CSV uploaded?','No, conversion runs in the browser tab.']],
  },
  'json-to-excel': {
    how: ['Select one valid JSON file.','Use a flat array of objects for the clearest table.','Convert the data.','Download the XLSX file.','Review nested values and types.'],
    uses: ['Convert saved API responses.','Share developer data with Excel users.','Inspect object records as rows.'],
    example: 'An array of objects with name and score keys becomes a worksheet with name and score columns.',
    issues: ['Invalid JSON: check quotes, commas, and brackets.','Nested objects: flatten them before conversion.','One row: a single object creates one record; use an array for multiple rows.'],
    faq: [['What structure works best?','A flat array of objects with consistent keys.'],['Can it create related sheets?','No, it creates one worksheet.'],['Are nested arrays flattened?','No.'],['Can invalid JSON be converted?','No, the file must be valid JSON.']],
  },
};

const Heading=({children}:{children:React.ReactNode})=><h2 className="text-3xl font-black tracking-tight md:text-4xl">{children}</h2>;

export default function SeoContent({tool,mergeMode}:{tool:ToolType;mergeMode:MergeMode}){
  const p=PAGES[tool];
  return <div className="border-t border-slate-100">
    <section className="mx-auto max-w-6xl px-5 py-16"><Heading>How to use this spreadsheet tool</Heading><ol className="mt-8 grid gap-4 md:grid-cols-5">{p.how.map((x,i)=><li key={x} className="rounded-2xl border p-5 text-sm leading-7 text-slate-600"><b className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">{i+1}</b>{x}</li>)}</ol></section>
    {tool==='merge'&&<section className="border-y bg-slate-50 px-5 py-16"><div className="mx-auto max-w-6xl"><Heading>Append Rows vs Keep Sheets</Heading><p className="mt-4 text-slate-600">Current selection: <b>{mergeMode==='append-rows'?'Append Rows':'Keep Sheets'}</b>.</p><div className="mt-8 overflow-x-auto rounded-2xl border bg-white"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-900 text-white"><tr><th className="p-4">Feature</th><th className="p-4">Append Rows</th><th className="p-4">Keep Sheets</th></tr></thead><tbody className="divide-y"><tr><th className="p-4">Output</th><td className="p-4">One combined table</td><td className="p-4">Separate worksheets</td></tr><tr><th className="p-4">Best for</th><td className="p-4">Similar headers</td><td className="p-4">Different layouts</td></tr><tr><th className="p-4">Duplicates</th><td className="p-4">Identical rows can be removed</td><td className="p-4">Not applied</td></tr><tr><th className="p-4">Excel features</th><td className="p-4">Table data focus</td><td className="p-4">Must be verified</td></tr></tbody></table></div></div></section>}
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-2"><div><Heading>Common use cases</Heading><div className="mt-7 grid gap-4">{p.uses.map(x=><p key={x} className="rounded-2xl border p-5 leading-7 text-slate-600">{x}</p>)}</div></div><div><Heading>Example output</Heading><p className="mt-7 rounded-3xl bg-slate-900 p-7 leading-8 text-slate-200">{p.example}</p><p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900"><b>Keep the originals.</b> Generated output must be checked before important operational use.</p></div></section>
    <section className="border-y bg-slate-50 px-5 py-16"><div className="mx-auto max-w-6xl"><Heading>Troubleshooting</Heading><div className="mt-8 grid gap-4 md:grid-cols-2">{p.issues.map(x=><p key={x} className="rounded-2xl border bg-white p-6 leading-7 text-slate-600">{x}</p>)}</div></div></section>
    <section className="mx-auto max-w-4xl px-5 py-16"><Heading>Frequently asked questions</Heading><div className="mt-8 divide-y rounded-2xl border px-6">{p.faq.map(([q,a])=><details key={q} className="py-5"><summary className="cursor-pointer font-black">{q}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{a}</p></details>)}</div></section>
  </div>;
}
