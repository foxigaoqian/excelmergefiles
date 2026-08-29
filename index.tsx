import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import ToolApp from './ToolApp';
import SeoContent from './SeoContent';
import { MergeMode, ToolType } from './types';

const GA_MEASUREMENT_ID = 'G-6B82XZX2D4';
const gaScriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

if (!document.querySelector(`script[src="${gaScriptSrc}"]`)) {
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = gaScriptSrc;
  document.head.appendChild(gaScript);

  const gaWindow = window as typeof window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };

  gaWindow.dataLayer = gaWindow.dataLayer || [];
  gaWindow.gtag = function gtag(..._args: unknown[]) {
    gaWindow.dataLayer!.push(arguments);
  };
  gaWindow.gtag('js', new Date());
  gaWindow.gtag('config', GA_MEASUREMENT_ID);
}

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
