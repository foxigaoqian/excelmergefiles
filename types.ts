
export type ToolType = 'merge' | 'excel-to-csv' | 'csv-to-excel' | 'json-to-excel' | 'splitter';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface MergeOptions {
  sheetName: string;
  removeDuplicates: boolean;
  addSourceColumn: boolean;
}

export interface SplitOptions {
  rowsPerFile: number;
}
