import React from 'react';
import ReactDOM from 'react-dom/client';
import ToolApp from './ToolApp';
import { MergeMode, ToolType } from './types';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

const initialTool = (rootElement.dataset.tool || 'merge') as ToolType;
const initialMergeMode = (rootElement.dataset.mergeMode || 'append-rows') as MergeMode;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ToolApp initialTool={initialTool} initialMergeMode={initialMergeMode} />
  </React.StrictMode>,
);
