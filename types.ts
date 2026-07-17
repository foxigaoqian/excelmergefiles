export type ToolType =
  | 'merge'
  | 'merge-csv'
  | 'excel-to-csv'
  | 'csv-to-excel'
  | 'json-to-excel'
  | 'splitter';

export type MergeMode = 'append-rows' | 'keep-sheets';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface MergeOptions {
  mode: MergeMode;
  sheetName: string;
  removeDuplicates: boolean;
  addSourceColumn: boolean;
}

export interface SplitOptions {
  rowsPerFile: number;
}
