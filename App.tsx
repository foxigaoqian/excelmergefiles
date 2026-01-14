
import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Trash2, 
  Settings, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronDown,
  FileJson,
  Scissors,
  FileText,
  Lightbulb,
  CheckCircle2,
  Cpu,
  MousePointer2,
  Clock,
  LayoutGrid,
  FileCode,
  Calendar,
  User,
  Menu,
  X,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { FileItem, MergeOptions } from './types';
import { mergeFiles } from './utils/excelProcessor';
import * as XLSX from 'xlsx';

// --- Types ---
type PageView = 'home' | 'excel-to-csv' | 'csv-to-excel' | 'json-to-excel' | 'excel-splitter' | 'blog' | 'privacy' | 'terms' | 'gdpr' | 'cookie';

interface ToolContent {
  title: string;
  subtitle: string;
  intro: string;
  whyTitle: string;
  whyDesc: string;
  features: { icon: any; title: string; desc: string }[];
  steps: { n: number; t: string; d: string }[];
  tips: string[];
  comparison: { feature: string; us: string; others: string }[];
  faqs: { q: string; a: string }[];
}

const PAGE_CONTENT: Record<string, ToolContent> = {
  home: {
    title: "Merge Excel Files Online",
    subtitle: "Combine multiple Excel spreadsheets into one file instantly. Support for XLSX, XLS, CSV, ODS and more. Secure client-side processing means your data never leaves your device.",
    intro: "ExcelMerge Pro is a high-performance, browser-based utility designed for professionals who handle large datasets. Whether you are consolidating monthly reports or merging customer lists, our tool provides a seamless experience without the need for expensive software.",
    whyTitle: "Why Choose Our Excel Merger?",
    whyDesc: "We built this tool to be the fastest and most secure option on the web. By keeping all data local, we solve the two biggest problems of online tools: privacy risks and upload wait times.",
    features: [
      { icon: ShieldCheck, title: "100% Private", desc: "Data stays in your browser. No server uploads ever." },
      { icon: Zap, title: "Instant Speed", desc: "Merge 100k+ rows in seconds using local processing power." },
      { icon: LayoutGrid, title: "Format Freedom", desc: "Mix and match XLSX, XLS, and CSV files effortlessly." }
    ],
    steps: [
      { n: 1, t: "Upload Files", d: "Drag and drop all the spreadsheets you want to combine." },
      { n: 2, t: "Configure", d: "Set your master sheet name and data cleaning options." },
      { n: 3, t: "Download", d: "Hit Merge and grab your perfectly unified Excel file." }
    ],
    tips: [
      "Ensure all files have consistent column headers for the best mapping results.",
      "Use the 'Track Source' option to easily identify where each row of data came from.",
      "Close heavy browser tabs to free up memory when processing massive files."
    ],
    comparison: [
      { feature: "Data Privacy", us: "100% Local", others: "Uploaded to Cloud" },
      { feature: "Processing Time", us: "Instant", others: "Dependent on Upload Speed" },
      { feature: "File Limits", us: "Unlimited Rows", others: "Often capped at 5-10MB" }
    ],
    faqs: [
      { q: "Where are my files uploaded?", a: "Nowhere! Unlike other tools, your files are processed entirely in your browser's memory. Your sensitive data never leaves your computer." },
      { q: "Is there a limit to the rows I can merge?", a: "No hard software limit. The only constraint is your computer's RAM. We've successfully tested merges with over 500,000 rows." },
      { q: "Can I merge different file formats like CSV and XLSX?", a: "Yes, you can mix and match CSV, XLS, and XLSX files in a single merge session." },
      { q: "What happens if my files have different column headers?", a: "ExcelMerge Pro creates columns for all unique headers found across all your files." }
    ]
  }
};

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Ultimate Guide to Merging Multiple Excel Files Without VBA",
    excerpt: "Consolidating spreadsheets doesn't have to be a nightmare involving complex macros. Learn the modern, secure way to merge your data using ExcelMerge Pro.",
    date: "June 15, 2025",
    author: "Alex Rivers",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    content: `Merging files is one of the most common tasks in data analysis. Traditionally, this required complex VBA macros or hours of manual copy-pasting.`
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<PageView>('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob, name: string } | null>(null);
  const [options, setOptions] = useState<MergeOptions>({
    sheetName: 'Merged Data',
    removeDuplicates: false,
    addSourceColumn: true
  });

  const content = PAGE_CONTENT.home;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        status: 'pending' as const
      }));
      setFiles(prev => [...prev, ...newFiles]);
      setResult(null);
    }
  };

  const clear = () => {
    setFiles([]);
    setResult(null);
  };

  const handleMergeAction = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const blob = await mergeFiles(files, options);
      setResult({ blob, name: `merged_${new Date().getTime()}.xlsx` });
    } catch (err) {
      alert("Error processing files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const renderToolSpecificInterface = () => (
    <div className="p-2">
      <label className="group relative block cursor-pointer">
        <div className="border-3 border-dashed border-slate-200 group-hover:border-emerald-400 rounded-[32px] p-12 md:p-24 transition-all bg-slate-50/50 group-hover:bg-emerald-50/20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform">
            <Upload className="w-10 h-10 text-emerald-500" />
          </div>
          <p className="text-2xl md:text-3xl font-extrabold text-slate-800">Drop files or click to upload</p>
          <p className="text-slate-400 mt-4 text-lg font-medium">Supports XLSX, XLS, and CSV</p>
          <input type="file" multiple accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
      </label>

      {files.length > 0 && (
        <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
              Ready to Merge
              <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full">{files.length}</span>
            </h3>
            <button onClick={clear} className="text-xs text-slate-400 hover:text-red-500 transition-colors font-bold uppercase tracking-widest">Clear List</button>
          </div>
          
          <div className="max-h-60 overflow-y-auto pr-2 space-y-3 mb-10 custom-scrollbar">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="truncate max-w-[180px] md:max-w-md">
                    <p className="text-sm font-bold text-slate-800">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button onClick={() => setFiles(f => f.filter(fi => fi.id !== file.id))} className="text-slate-300 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-slate-50/50 rounded-[32px] p-8 border border-slate-100 mb-10">
            <div className="flex items-center gap-2 mb-6 text-slate-700 font-extrabold text-base">
              <Settings className="w-5 h-5 text-emerald-500" />
              Settings
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Sheet Name</label>
                <input 
                  type="text" 
                  value={options.sheetName} 
                  onChange={(e) => setOptions(p => ({...p, sheetName: e.target.value}))} 
                  className="w-full px-6 py-3.5 bg-white border-2 border-slate-100 rounded-xl text-base font-bold outline-none focus:ring-4 focus:ring-emerald-50 transition-all"
                />
              </div>
              <div className="space-y-4 flex flex-col justify-center">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={options.addSourceColumn} onChange={(e) => setOptions(p => ({...p, addSourceColumn: e.target.checked}))} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Add source filename column</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={options.removeDuplicates} onChange={(e) => setOptions(p => ({...p, removeDuplicates: e.target.checked}))} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">Remove exact duplicates</span>
                </label>
              </div>
            </div>
          </div>

          {!result ? (
            <button onClick={handleMergeAction} disabled={isProcessing} className="w-full py-6 bg-emerald-600 text-white font-extrabold text-xl rounded-[24px] shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
              {isProcessing ? "Processing..." : "Merge Files Now"} 
              {!isProcessing && <ArrowRight className="w-6 h-6" />}
            </button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => {
                const url = URL.createObjectURL(result.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.name;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
              }} className="py-6 bg-emerald-500 text-white font-extrabold text-xl rounded-[24px] shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                <Download className="w-6 h-6" /> Download .xlsx
              </button>
              <button onClick={clear} className="py-6 bg-slate-100 text-slate-600 font-extrabold text-xl rounded-[24px] hover:bg-slate-200 transition-all">Start Over</button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const Nav = () => (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView('home'); setSelectedPostId(null); window.scrollTo(0, 0); }}>
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-all">
              <FileSpreadsheet className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">ExcelMerge Pro</span>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {['Home', 'Blog'].map((item) => (
              <button 
                key={item}
                onClick={() => { setView(item.toLowerCase() as any); setSelectedPostId(null); window.scrollTo(0, 0); }} 
                className={`text-sm font-bold transition-all ${view === item.toLowerCase() ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      <Nav />
      <main className="flex-grow">
        {view === 'home' ? (
          <div className="space-y-16 md:space-y-24">
            <section className="pt-20 pb-16 px-4">
              <div className="max-w-5xl mx-auto text-center mb-10">
                {/* Refined Tool Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-16 h-16 bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex items-center justify-center border border-slate-100 transition-transform hover:scale-105">
                    <FileSpreadsheet className="w-9 h-9 text-emerald-500" />
                  </div>
                </div>

                {/* Styled Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f1f4ff] text-slate-600 text-[11px] font-extrabold mb-10 border border-[#e5e9ff] shadow-sm tracking-wide">
                  100% FREE • NO REGISTRATION REQUIRED
                </div>

                {/* Exact Gradient Title from Screenshot */}
                <h1 className="text-5xl md:text-[88px] font-extrabold mb-10 tracking-tight leading-[0.98] text-transparent bg-clip-text bg-gradient-to-r from-[#00966d] via-[#868c28] to-[#f2711c]">
                  Merge Excel Files Online
                </h1>

                {/* Subtitle Styling */}
                <p className="text-lg md:text-[21px] text-slate-500 max-w-[820px] mx-auto font-medium leading-[1.6] mb-12">
                  Combine multiple Excel spreadsheets into one file instantly. Support for XLSX, XLS, CSV, ODS and more. Secure client-side processing means your data never leaves your device.
                </p>

                {/* Feature Highlights with Centered Checkmarks */}
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-slate-600 font-bold text-[16px]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> No file size limits
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> Multiple file formats
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> 100% secure & private
                  </div>
                </div>
              </div>

              {/* Upload Card */}
              <div className="max-w-4xl mx-auto mt-20">
                <div className="bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
                  <div className="p-4 md:p-14">
                    {renderToolSpecificInterface()}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : view === 'privacy' ? (
          <div className="py-24 max-w-4xl mx-auto px-4">
             <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 p-8 md:p-20">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">Privacy Policy</h1>
                <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed space-y-6">
                  <p>At ExcelMerge Pro, accessible from https://mergeexcelfiles.online, one of our main priorities is the privacy of our visitors.</p>
                  <p>ExcelMerge Pro follows a standard procedure of using log files... (content continue)</p>
                  <p>Local Processing Notice: All files stay on your machine.</p>
                </div>
             </div>
          </div>
        ) : (
          <div className="py-24 text-center">Blog View Coming Soon...</div>
        )}
      </main>
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <p className="text-slate-300 font-bold text-lg">© {new Date().getFullYear()} ExcelMerge Pro. Your files never leave your machine.</p>
          <div className="flex justify-center gap-6 text-sm font-bold text-slate-500">
            <button onClick={() => setView('privacy')}>Privacy Policy</button>
            <span>|</span>
            <button>Terms of Service</button>
          </div>
          <p className="text-slate-600 text-xs max-w-2xl mx-auto">
            ExcelMerge Pro is your secure utility for merging XLSX, XLS, and CSV files locally. 100% private, no uploads.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
