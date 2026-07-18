import React from 'react';
import ReactDOM from 'react-dom/client';
import ToolApp from './ToolApp';
import SeoContent from './SeoContent';
import { MergeMode, ToolType } from './types';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

const initialTool = (rootElement.dataset.tool || 'merge') as ToolType;
const initialMergeMode = (rootElement.dataset.mergeMode || 'append-rows') as MergeMode;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ToolApp initialTool={initialTool} initialMergeMode={initialMergeMode} />
    <style>{`#root > div:first-of-type > footer{display:none}`}</style>
    <SeoContent tool={initialTool} mergeMode={initialMergeMode} />
    <footer className="border-t border-slate-200 px-5 py-8"><div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:justify-between"><span>© 2026 MergeExcelFiles.online</span><nav className="flex flex-wrap gap-4"><a href="/privacy-policy/">Privacy</a><a href="/terms/">Terms</a><a href="/contact/">Contact</a><a href="/sitemap.xml">Sitemap</a></nav></div></footer>
  </React.StrictMode>,
);
