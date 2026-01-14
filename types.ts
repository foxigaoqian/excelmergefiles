
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
