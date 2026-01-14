
import * as XLSX from 'xlsx';
import { FileItem, MergeOptions } from '../types';

export const mergeFiles = async (
  fileItems: FileItem[], 
  options: MergeOptions
): Promise<Blob> => {
  const finalData: any[] = [];
  
  for (const item of fileItems) {
    const data = await item.file.arrayBuffer();
    const workbook = XLSX.read(data);
    
    // Process each sheet in the workbook
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);
      
      const processedData = jsonData.map((row: any) => {
        const newRow = { ...row };
        if (options.addSourceColumn) {
          // Add source filename as a prefix to avoid collisions with existing columns
          newRow['__Source_File'] = item.name;
        }
        return newRow;
      });
      
      finalData.push(...processedData);
    });
  }

  // Handle Duplicates if selected
  let resultData = finalData;
  if (options.removeDuplicates) {
    // Unique check by stringifying the row object (excluding the source file column if desired, 
    // but here we keep it simple for the user)
    const seen = new Set();
    resultData = finalData.filter(item => {
      const serial = JSON.stringify(item);
      if (seen.has(serial)) return false;
      seen.add(serial);
      return true;
    });
  }

  // Create new Workbook
  const newSheet = XLSX.utils.json_to_sheet(resultData);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, options.sheetName || "MergedData");

  // Generate output
  const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};
