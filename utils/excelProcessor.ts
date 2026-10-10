import type * as XLSXTypes from 'xlsx';
import { FileItem, MergeOptions, SplitOptions } from '../types';

type XlsxLib = typeof import('xlsx');

let xlsxPromise: Promise<XlsxLib> | null = null;

/**
 * Lazy-load SheetJS on first use so the ~800KB parser is split into its own
 * chunk and never downloaded on initial page load.
 */
function loadXlsx(): Promise<XlsxLib> {
  if (!xlsxPromise) xlsxPromise = import('xlsx');
  return xlsxPromise;
}

function fileBaseName(name: string): string {
  return name.replace(/\.[^/.]+$/, '');
}

function sanitizeSheetName(value: string, fallback = 'Sheet'): string {
  const cleaned = value.replace(/[\\/?*\[\]:]/g, ' ').trim() || fallback;
  return cleaned.slice(0, 31);
}

function uniqueSheetName(workbook: XLSXTypes.WorkBook, preferred: string): string {
  const base = sanitizeSheetName(preferred);
  if (!workbook.SheetNames.includes(base)) return base;

  for (let suffix = 2; suffix < 10_000; suffix += 1) {
    const suffixText = `_${suffix}`;
    const candidate = `${base.slice(0, 31 - suffixText.length)}${suffixText}`;
    if (!workbook.SheetNames.includes(candidate)) return candidate;
  }

  throw new Error('Unable to create a unique worksheet name.');
}

async function readWorkbook(xlsx: XlsxLib, file: File): Promise<XLSXTypes.WorkBook> {
  if (/\.csv$/i.test(file.name)) {
    const text = await file.text();
    return xlsx.read(text, { type: 'string', cellDates: true, raw: false });
  }

  const data = await file.arrayBuffer();
  return xlsx.read(data, {
    type: 'array',
    cellDates: true,
    cellStyles: true,
  });
}

function outputBlob(xlsx: XlsxLib, workbook: XLSXTypes.WorkBook): Blob {
  const bytes = xlsx.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles: true });
  return new Blob([bytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export const mergeFiles = async (
  fileItems: FileItem[],
  options: MergeOptions,
): Promise<Blob> => {
  const xlsx = await loadXlsx();
  if (fileItems.length < 2) throw new Error('Select at least two files to merge.');

  if (options.mode === 'keep-sheets') {
    const output = xlsx.utils.book_new();

    for (const item of fileItems) {
      const workbook = await readWorkbook(xlsx, item.file);
      for (const sourceSheetName of workbook.SheetNames) {
        const sourceSheet = workbook.Sheets[sourceSheetName];
        if (!sourceSheet) continue;

        const preferredName = `${fileBaseName(item.name)}_${sourceSheetName}`;
        xlsx.utils.book_append_sheet(
          output,
          { ...sourceSheet },
          uniqueSheetName(output, preferredName),
        );
      }
    }

    if (output.SheetNames.length === 0) throw new Error('No worksheets were found in the selected files.');
    return outputBlob(xlsx, output);
  }

  const combinedRows: Record<string, unknown>[] = [];

  for (const item of fileItems) {
    const workbook = await readWorkbook(xlsx, item.file);
    for (const sourceSheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sourceSheetName];
      if (!sheet) continue;

      const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: null,
        raw: true,
      });

      for (const row of rows) {
        const outputRow: Record<string, unknown> = { ...row };
        if (options.addSourceColumn) {
          outputRow.__Source_File = item.name;
          outputRow.__Source_Sheet = sourceSheetName;
        }
        combinedRows.push(outputRow);
      }
    }
  }

  let resultRows = combinedRows;
  if (options.removeDuplicates) {
    const seen = new Set<string>();
    resultRows = combinedRows.filter((row) => {
      const signature = JSON.stringify(row);
      if (seen.has(signature)) return false;
      seen.add(signature);
      return true;
    });
  }

  if (resultRows.length === 0) {
    throw new Error('No tabular data rows were found. Check that the first row contains column headers.');
  }

  const outputSheet = xlsx.utils.json_to_sheet(resultRows);
  const output = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(
    output,
    outputSheet,
    sanitizeSheetName(options.sheetName, 'Merged_Data'),
  );
  return outputBlob(xlsx, output);
};

export const convertToCsv = async (fileItem: FileItem): Promise<Blob> => {
  const xlsx = await loadXlsx();
  const workbook = await readWorkbook(xlsx, fileItem.file);
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error('The workbook does not contain a worksheet.');
  const csv = xlsx.utils.sheet_to_csv(workbook.Sheets[firstSheetName]);
  return new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
};

export const convertCsvToExcel = async (fileItem: FileItem): Promise<Blob> => {
  const xlsx = await loadXlsx();
  const workbook = await readWorkbook(xlsx, fileItem.file);
  return outputBlob(xlsx, workbook);
};

export const convertJsonToExcel = async (fileItem: FileItem): Promise<Blob> => {
  const xlsx = await loadXlsx();
  const text = await fileItem.file.text();
  const json: unknown = JSON.parse(text);
  const rows = Array.isArray(json) ? json : [json];
  if (rows.length === 0) throw new Error('The JSON file contains no records.');

  const worksheet = xlsx.utils.json_to_sheet(rows as Record<string, unknown>[]);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');
  return outputBlob(xlsx, workbook);
};

export const splitExcelFile = async (
  fileItem: FileItem,
  options: SplitOptions,
): Promise<Blob[]> => {
  const xlsx = await loadXlsx();
  const rowsPerFile = Math.max(1, Math.min(1_000_000, Math.floor(options.rowsPerFile)));
  const workbook = await readWorkbook(xlsx, fileItem.file);
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error('The workbook does not contain a worksheet.');

  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[firstSheetName], {
    defval: null,
    raw: true,
  });
  if (rows.length === 0) throw new Error('The first worksheet contains no tabular data rows.');

  const blobs: Blob[] = [];
  for (let index = 0; index < rows.length; index += rowsPerFile) {
    const chunk = rows.slice(index, index + rowsPerFile);
    const sheet = xlsx.utils.json_to_sheet(chunk);
    const output = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(output, sheet, sanitizeSheetName(firstSheetName));
    blobs.push(outputBlob(xlsx, output));
  }
  return blobs;
};
