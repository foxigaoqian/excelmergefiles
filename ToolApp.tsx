import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  Trash2,
  Upload,
} from 'lucide-react';
import { FileItem, MergeMode, MergeOptions, SplitOptions, ToolType } from './types';
import {
  convertCsvToExcel,
  convertJsonToExcel,
  convertToCsv,
  mergeFiles,
  splitExcelFile,
} from './utils/excelProcessor';

const ROUTES = [
  ['/', 'Merge Excel'],
  ['/merge-excel-files-keep-sheets/', 'Keep Sheets'],
  ['/merge-csv-files/', 'Merge CSV'],
  ['/split-excel-by-rows/', 'Split Excel'],
  ['/excel-to-csv/', 'Excel to CSV'],
  ['/csv-to-excel/', 'CSV to Excel'],
  ['/json-to-excel/', 'JSON to Excel'],
] as const;

type ToolConfig = {
  title: string;
  subtitle: string;
  description: string;
  accept: string;
  multiple: boolean;
  button: string;
  limits: string[];
};

const CONFIG: Record<ToolType, ToolConfig> = {
  merge: {
    title: 'Merge Excel Files',
    subtitle: 'Append table rows or keep source worksheets',
    description: 'Combine XLSX, XLS, or CSV files locally in your browser. Choose the merge mode that matches the structure you need.',
    accept: '.xlsx,.xls,.csv',
    multiple: true,
    button: 'Merge Selected Files',
    limits: [
      'Append Rows converts every worksheet into table rows and expects headers in the first row.',
      'Keep Sheets copies source worksheets into one workbook where supported by the spreadsheet library.',
      'Charts, macros, external connections, advanced styling, and unsupported Excel features may change or be removed.',
    ],
  },
  'merge-csv': {
    title: 'Merge CSV Files',
    subtitle: 'Append multiple CSV tables into one XLSX worksheet',
    description: 'Combine records from two or more CSV files. Different header names become separate output columns.',
    accept: '.csv',
    multiple: true,
    button: 'Merge CSV Files',
    limits: [
      'The first row of every CSV is treated as column headers.',
      'CSV files do not contain Excel formatting, charts, formulas, or multiple worksheets.',
      'The result is an XLSX workbook containing one merged data worksheet.',
    ],
  },
  splitter: {
    title: 'Split Excel by Rows',
    subtitle: 'Create smaller XLSX files from the first worksheet',
    description: 'Choose the number of data rows for each output file. Processing happens locally in this browser tab.',
    accept: '.xlsx,.xls',
    multiple: false,
    button: 'Split First Worksheet',
    limits: [
      'Only the first worksheet is split.',
      'The first row is treated as column headers and repeated in every part.',
      'Advanced workbook features are not preserved in the generated parts.',
    ],
  },
  'excel-to-csv': {
    title: 'Excel to CSV',
    subtitle: 'Export the first worksheet as UTF-8 CSV',
    description: 'Convert the first worksheet of an XLSX or XLS workbook into one flat CSV file.',
    accept: '.xlsx,.xls',
    multiple: false,
    button: 'Convert First Sheet to CSV',
    limits: [
      'CSV supports one flat table, so only the first worksheet is exported.',
      'Formatting, charts, images, comments, and workbook settings are not part of CSV.',
      'Formula cells use the values available to the browser parser.',
    ],
  },
  'csv-to-excel': {
    title: 'CSV to Excel',
    subtitle: 'Create a single-sheet XLSX workbook',
    description: 'Turn one CSV file into an XLSX workbook without uploading the file to an application processing server.',
    accept: '.csv',
    multiple: false,
    button: 'Convert CSV to Excel',
    limits: [
      'The CSV becomes one worksheet.',
      'Delimiter and encoding interpretation depend on the browser spreadsheet parser.',
      'Custom styling and formulas are not inferred from CSV text.',
    ],
  },
  'json-to-excel': {
    title: 'JSON to Excel',
    subtitle: 'Turn JSON records into a worksheet',
    description: 'Convert a JSON array, or one JSON object, into one XLSX worksheet in your browser.',
    accept: '.json',
    multiple: false,
    button: 'Convert JSON to Excel',
    limits: [
      'Flat arrays of objects create the clearest table.',
      'Nested values are not automatically normalized into multiple relational tables.',
      'Invalid or empty JSON returns an error rather than an empty workbook.',
    ],
  },
};

interface ToolAppProps {
  initialTool?: ToolType;
  initialMergeMode?: MergeMode;
}

function extension(name: string) {
  return name.toLowerCase().match(/\.[^.]+$/)?.[0] || '';
}

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function ToolApp({ initialTool = 'merge', initialMergeMode = 'append-rows' }: ToolAppProps) {
  const config = CONFIG[initialTool];
  const [files, setFiles] = useState<FileItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Array<{ blob: Blob; name: string }>>([]);
  const [mergeOptions, setMergeOptions] = useState<MergeOptions>({
    mode: initialTool === 'merge-csv' ? 'append-rows' : initialMergeMode,
    sheetName: initialTool === 'merge-csv' ? 'Merged_CSV_Data' : 'Merged_Data',
    removeDuplicates: false,
    addSourceColumn: true,
  });
  const [splitOptions, setSplitOptions] = useState<SplitOptions>({ rowsPerFile: 1000 });
  const allowed = useMemo(() => new Set(config.accept.split(',').map((item) => item.trim())), [config.accept]);

  function selectFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    const rejected = selected.filter((file) => !allowed.has(extension(file.name)));
    const accepted = selected.filter((file) => allowed.has(extension(file.name)));
    setError(rejected.length ? `Unsupported file type: ${rejected.map((file) => file.name).join(', ')}` : '');
    const items = accepted.map((file) => ({ id: crypto.randomUUID(), file, name: file.name, size: file.size, status: 'pending' as const }));
    setFiles((current) => (config.multiple ? [...current, ...items] : items.slice(0, 1)));
    setResults([]);
    event.target.value = '';
  }

  function move(index: number, offset: -1 | 1) {
    setFiles((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(id: string) {
    setFiles((current) => current.filter((file) => file.id !== id));
    setResults([]);
  }

  async function run() {
    setError('');
    setResults([]);
    if (!files.length) return setError(`Select ${config.multiple ? 'files' : 'a file'} first.`);
    if ((initialTool === 'merge' || initialTool === 'merge-csv') && files.length < 2) return setError('Select at least two files to merge.');

    setProcessing(true);
    try {
      if (initialTool === 'merge' || initialTool === 'merge-csv') {
        const blob = await mergeFiles(files, { ...mergeOptions, mode: initialTool === 'merge-csv' ? 'append-rows' : mergeOptions.mode });
        setResults([{ blob, name: initialTool === 'merge-csv' ? 'merged_csv_data.xlsx' : 'merged_excel_files.xlsx' }]);
      } else if (initialTool === 'excel-to-csv') {
        setResults([{ blob: await convertToCsv(files[0]), name: `${files[0].name.replace(/\.[^/.]+$/, '')}.csv` }]);
      } else if (initialTool === 'csv-to-excel') {
        setResults([{ blob: await convertCsvToExcel(files[0]), name: `${files[0].name.replace(/\.[^/.]+$/, '')}.xlsx` }]);
      } else if (initialTool === 'json-to-excel') {
        setResults([{ blob: await convertJsonToExcel(files[0]), name: `${files[0].name.replace(/\.[^/.]+$/, '')}.xlsx` }]);
      } else {
        const blobs = await splitExcelFile(files[0], splitOptions);
        setResults(blobs.map((blob, index) => ({ blob, name: `part_${index + 1}_${files[0].name.replace(/\.xls$/i, '.xlsx')}` })));
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The selected file could not be processed.');
    } finally {
      setProcessing(false);
    }
  }

  function download(result: { blob: Blob; name: string }) {
    const url = URL.createObjectURL(result.blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = result.name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center gap-6 overflow-x-auto px-5">
          <a href="/" className="flex shrink-0 items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"><FileSpreadsheet /></span><strong>MergeExcelFiles.online</strong></a>
          <nav className="ml-auto flex shrink-0 gap-5" aria-label="Spreadsheet tools">{ROUTES.map(([href, label]) => <a key={href} href={href} className="text-sm font-semibold text-slate-500 hover:text-slate-950">{label}</a>)}</nav>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-100 px-5 py-16 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700"><CheckCircle className="h-4 w-4" />File contents stay in this browser tab</div>
              <h1 className="text-4xl font-black tracking-tight md:text-6xl">{config.title}</h1>
              <p className="mt-3 text-xl font-bold text-slate-300">{config.subtitle}</p>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">{config.description}</p>
            </div>

            <div className="grid gap-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl md:p-10 lg:grid-cols-5">
              <div className="space-y-5 lg:col-span-3">
                <label className="relative flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center hover:border-slate-900 hover:bg-white">
                  <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white"><Upload /></span>
                  <strong className="text-xl">Select {config.multiple ? 'two or more files' : 'one file'}</strong>
                  <span className="mt-2 text-sm text-slate-500">Accepted: {config.accept.replaceAll(',', ', ')}</span>
                  <input type="file" className="absolute inset-0 cursor-pointer opacity-0" accept={config.accept} multiple={config.multiple} onChange={selectFiles} />
                </label>
                {files.map((file, index) => (
                  <div key={file.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{file.name}</p><p className="text-xs text-slate-400">{sizeLabel(file.size)}</p></div>
                    {config.multiple && <button type="button" onClick={() => move(index, -1)} disabled={!index} className="rounded-lg bg-white p-2 disabled:opacity-30" aria-label="Move file up"><ChevronUp className="h-4 w-4" /></button>}
                    {config.multiple && <button type="button" onClick={() => move(index, 1)} disabled={index === files.length - 1} className="rounded-lg bg-white p-2 disabled:opacity-30" aria-label="Move file down"><ChevronDown className="h-4 w-4" /></button>}
                    <button type="button" onClick={() => remove(file.id)} className="rounded-lg bg-white p-2 text-red-500" aria-label="Remove file"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>

              <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:col-span-2">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">Options</h2>
                {(initialTool === 'merge' || initialTool === 'merge-csv') && <div className="mt-5 space-y-4">
                  {initialTool === 'merge' && <div><label className="mb-2 block text-sm font-bold">Merge mode</label><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setMergeOptions((value) => ({ ...value, mode: 'append-rows' }))} className={`rounded-xl border p-3 text-sm font-bold ${mergeOptions.mode === 'append-rows' ? 'bg-slate-900 text-white' : 'bg-white'}`}>Append Rows</button><button type="button" onClick={() => setMergeOptions((value) => ({ ...value, mode: 'keep-sheets' }))} className={`rounded-xl border p-3 text-sm font-bold ${mergeOptions.mode === 'keep-sheets' ? 'bg-slate-900 text-white' : 'bg-white'}`}>Keep Sheets</button></div></div>}
                  {(initialTool === 'merge-csv' || mergeOptions.mode === 'append-rows') && <><label className="block text-sm font-bold">Output sheet name<input value={mergeOptions.sheetName} maxLength={31} onChange={(event) => setMergeOptions((value) => ({ ...value, sheetName: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-normal" /></label><label className="flex gap-3 rounded-xl border bg-white p-3 text-sm"><input type="checkbox" checked={mergeOptions.addSourceColumn} onChange={(event) => setMergeOptions((value) => ({ ...value, addSourceColumn: event.target.checked }))} /><span>Add source file and sheet columns</span></label><label className="flex gap-3 rounded-xl border bg-white p-3 text-sm"><input type="checkbox" checked={mergeOptions.removeDuplicates} onChange={(event) => setMergeOptions((value) => ({ ...value, removeDuplicates: event.target.checked }))} /><span>Remove completely identical rows</span></label></>}
                  {initialTool === 'merge' && mergeOptions.mode === 'keep-sheets' && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Verify formulas, styles, charts, macros, and external links after download.</p>}
                </div>}
                {initialTool === 'splitter' && <label className="mt-5 block text-sm font-bold">Rows per output file<input type="number" min="1" max="1000000" value={splitOptions.rowsPerFile} onChange={(event) => setSplitOptions({ rowsPerFile: Math.max(1, Number(event.target.value) || 1) })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-normal" /></label>}
                {!['merge', 'merge-csv', 'splitter'].includes(initialTool) && <p className="mt-5 rounded-xl border bg-white p-4 text-sm leading-relaxed text-slate-600">Review the output carefully. Conversion focuses on table data, not complete workbook feature preservation.</p>}
                {error && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertTriangle className="mr-2 inline h-4 w-4" />{error}</div>}
                <div className="mt-6">{results.length ? <div className="space-y-3">{results.map((result) => <button key={result.name} type="button" onClick={() => download(result)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 font-bold text-white"><Download className="h-5 w-5" />Download {result.name}</button>)}<button type="button" onClick={() => { setFiles([]); setResults([]); }} className="w-full rounded-xl border bg-white p-3 text-sm font-bold">Start again</button></div> : <button type="button" onClick={run} disabled={processing} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-4 font-bold text-white disabled:opacity-50">{processing ? 'Processing locally...' : config.button}<ArrowRight className="h-5 w-5" /></button>}</div>
              </aside>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-5 py-16 lg:grid-cols-2">
          <div><h2 className="text-3xl font-black">What this tool changes</h2><div className="mt-6 space-y-3">{config.limits.map((limit) => <div key={limit} className="flex gap-3 rounded-xl border border-slate-200 p-4 text-sm leading-relaxed text-slate-600"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />{limit}</div>)}</div></div>
          <div className="rounded-3xl bg-slate-50 p-8"><h2 className="text-2xl font-black">Verify every output</h2><ol className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600"><li><strong className="text-slate-900">Keep original files.</strong> Do not overwrite the only copy of important data.</li><li><strong className="text-slate-900">Check row and column counts.</strong> Confirm headers, dates, formulas, and identifiers.</li><li><strong className="text-slate-900">Open the result in Excel.</strong> Verify features beyond plain table data before relying on it.</li></ol></div>
        </section>

        <section className="border-y border-slate-100 bg-slate-50 px-5 py-16"><div className="mx-auto max-w-6xl"><h2 className="text-center text-3xl font-black">Related spreadsheet tools</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ROUTES.map(([href, label]) => <a key={href} href={href} className="rounded-2xl border border-slate-200 bg-white p-5 font-bold hover:border-slate-900">{label}<span className="float-right">→</span></a>)}</div></div></section>
      </main>

      <footer className="border-t border-slate-200 px-5 py-8"><div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:justify-between"><span>© 2026 MergeExcelFiles.online</span><span>Files are processed locally. Keep backups and verify generated output.</span></div></footer>
    </div>
  );
}
