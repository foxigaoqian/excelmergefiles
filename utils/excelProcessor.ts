
import * as XLSX from 'xlsx';
import { FileItem, MergeOptions, SplitOptions } from '../types';

export const mergeFiles = async (
  fileItems: FileItem[], 
  options: MergeOptions
): Promise<Blob> => {
  const finalData: any[] = [];
  
  for (const item of fileItems) {
    const data = await item.file.arrayBuffer();
    const workbook = XLSX.read(data);
    
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
      
      const processedData = jsonData.map((row: any) => {
        const newRow = { ...row };
        if (options.addSourceColumn) {
          newRow['__Source_File'] = item.name;
        }
        return newRow;
      });
      
      finalData.push(...processedData);
    });
  }

  let resultData = finalData;
  if (options.removeDuplicates) {
    const seen = new Set();
    resultData = finalData.filter(item => {
      const serial = JSON.stringify(item);
      if (seen.has(serial)) return false;
      seen.add(serial);
      return true;
    });
  }

  const newSheet = XLSX.utils.json_to_sheet(resultData);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, options.sheetName || "MergedData");

  const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const convertToCsv = async (fileItem: FileItem): Promise<Blob> => {
  const data = await fileItem.file.arrayBuffer();
  const workbook = XLSX.read(data);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  return new Blob([csv], { type: 'text/csv' });
};

export const convertCsvToExcel = async (fileItem: FileItem): Promise<Blob> => {
  const text = await fileItem.file.text();
  const workbook = XLSX.read(text, { type: 'string' });
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const convertJsonToExcel = async (fileItem: FileItem): Promise<Blob> => {
  const text = await fileItem.file.text();
  const json = JSON.parse(text);
  const worksheet = XLSX.utils.json_to_sheet(Array.isArray(json) ? json : [json]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

export const splitExcelFile = async (fileItem: FileItem, options: SplitOptions): Promise<Blob[]> => {
  const data = await fileItem.file.arrayBuffer();
  const workbook = XLSX.read(data);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData: any[] = XLSX.utils.sheet_to_json(firstSheet);
  
  const blobs: Blob[] = [];
  for (let i = 0; i < jsonData.length; i += options.rowsPerFile) {
    const chunk = jsonData.slice(i, i + options.rowsPerFile);
    const newSheet = XLSX.utils.json_to_sheet(chunk);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Split_Data");
    const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    blobs.push(new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  }
  return blobs;
};
