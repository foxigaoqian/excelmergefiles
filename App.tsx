import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Upload, Trash2, Settings, Download, ArrowRight,
  ShieldCheck, Zap, ChevronDown, Scissors, FileText, FileCode,
  LayoutGrid, Database, Star, ChevronUp, CheckCircle, Menu, X, Lock, Globe, Mail,
  Cpu, MousePointer2, Layers, AlertCircle
} from 'lucide-react';
import { FileItem, MergeOptions, ToolType, SplitOptions } from './types';
import { 
  mergeFiles, convertToCsv, convertCsvToExcel, 
  convertJsonToExcel, splitExcelFile 
} from './utils/excelProcessor';

type PageView = 'home' | 'privacy' | 'terms' | 'contact';

const App: React.FC = () => {
  const [view, setView] = useState<PageView>('home');
  const [activeTool, setActiveTool] = useState<ToolType>('merge');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ blob: Blob, name: string }[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [mergeOptions, setMergeOptions] = useState<MergeOptions>({
    sheetName: 'Merged_Results',
    removeDuplicates: false,
    addSourceColumn: true
  });

  const [splitOptions, setSplitOptions] = useState<SplitOptions>({
    rowsPerFile: 1000
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        status: 'pending' as const
      }));
      
      if (['excel-to-csv', 'csv-to-excel', 'json-to-excel', 'splitter'].includes(activeTool)) {
        setFiles(newFiles.slice(0, 1));
      } else {
        setFiles(prev => [...prev, ...newFiles]);
      }
      setResults([]);
    }
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    setFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (files.length <= 1) setResults([]);
  };

  const clear = () => {
    setFiles([]);
    setResults([]);
  };

  const runTool = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      if (activeTool === 'merge') {
        const blob = await mergeFiles(files, mergeOptions);
        setResults([{ blob, name: `merged_excel_${Date.now()}.xlsx` }]);
      } else if (activeTool === 'excel-to-csv') {
        const blob = await convertToCsv(files[0]);
        setResults([{ blob, name: `${files[0].name.replace(/\.[^/.]+$/, "")}.csv` }]);
      } else if (activeTool === 'csv-to-excel') {
        const blob = await convertCsvToExcel(files[0]);
        setResults([{ blob, name: `${files[0].name.replace(/\.[^/.]+$/, "")}.xlsx` }]);
      } else if (activeTool === 'json-to-excel') {
        const blob = await convertJsonToExcel(files[0]);
        setResults([{ blob, name: `${files[0].name.replace(/\.[^/.]+$/, "")}.xlsx` }]);
      } else if (activeTool === 'splitter') {
        const blobs = await splitExcelFile(files[0], splitOptions);
        setResults(blobs.map((b, i) => ({ blob: b, name: `part_${i + 1}_${files[0].name}` })));
      }
    } catch (err) {
      alert("Error processing file. Please ensure files are valid format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const switchTool = (tool: ToolType) => {
    setActiveTool(tool);
    setView('home');
    clear();
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (p: PageView) => {
    setView(p);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Layout Components ---

  const NavLogo = () => (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
        <FileSpreadsheet className="w-6 h-6" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">MERGEEXCELFILES</span>
        <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">.online</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="h-20 border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <NavLogo />
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => switchTool('merge')} className={`text-sm font-bold tracking-tight ${activeTool === 'merge' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>Merge Excel</button>
          <button onClick={() => switchTool('splitter')} className={`text-sm font-bold tracking-tight ${activeTool === 'splitter' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>Split Sheets</button>
          <button onClick={() => switchTool('excel-to-csv')} className={`text-sm font-bold tracking-tight ${activeTool === 'excel-to-csv' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>Excel to CSV</button>
          <button onClick={() => switchTool('csv-to-excel')} className={`text-sm font-bold tracking-tight ${activeTool === 'csv-to-excel' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-900'}`}>CSV to Excel</button>
        </div>
        <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Main Content Conditional Views */}
      {view === 'privacy' && <div className="max-w-4xl mx-auto py-20 px-6 animate-in"><h1 className="text-4xl font-black mb-8 text-slate-900">Privacy Policy</h1><div className="prose text-slate-600 space-y-4 font-medium"><p>All processing is local. We don't upload files.</p><button onClick={() => navigateTo('home')} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Back Home</button></div></div>}
      {view === 'terms' && <div className="max-w-4xl mx-auto py-20 px-6 animate-in"><h1 className="text-4xl font-black mb-8 text-slate-900">Terms of Service</h1><div className="prose text-slate-600 space-y-4 font-medium"><p>Free to use, as-is, no guarantee. Don't be evil.</p><button onClick={() => navigateTo('home')} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Back Home</button></div></div>}
      {view === 'contact' && <div className="max-w-4xl mx-auto py-20 px-6 animate-in text-center"><h1 className="text-4xl font-black mb-8 text-slate-900">Contact Us</h1><p className="text-xl text-slate-500 font-bold mb-4">support@mergeexcelfiles.online</p><button onClick={() => navigateTo('home')} className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Back Home</button></div>}

      {view === 'home' && (
        <>
          {/* 1. TOOL SECTION (Hero) */}
          <section className="pt-16 pb-24 px-6 border-b border-slate-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                  <Lock className="w-3 h-3" /> Secure Client-Side Engine
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-6">
                  Merge Excel Files <br className="hidden md:block" /> 
                  <span className="text-slate-200">Without Uploads.</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                  The professional way to combine XLSX and CSV spreadsheets. 
                  Zero data leakage, maximum privacy, instant execution.
                </p>
              </div>

              {/* Tool Card */}
              <div className="bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden card-shadow">
                <div className="p-8 md:p-12">
                  <div className="grid lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3 space-y-6">
                      <label className={`group relative flex flex-col items-center justify-center border-4 border-dashed rounded-[32px] transition-all duration-300 cursor-pointer 
                        ${files.length > 0 ? 'h-40 bg-slate-50 border-slate-200' : 'h-80 bg-slate-50 border-slate-300 hover:border-slate-900 hover:bg-white'}`}>
                        <div className="flex flex-col items-center">
                          <div className={`bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-4 transition-all ${files.length > 0 ? 'w-10 h-10' : 'w-16 h-16'}`}>
                            <Upload className="text-white w-6 h-6" />
                          </div>
                          <span className="font-black text-slate-900 text-xl">
                            {files.length > 0 ? 'Add more spreadsheets' : 'Drop XLSX / CSV Files'}
                          </span>
                        </div>
                        <input type="file" multiple={activeTool === 'merge'} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept=".xlsx,.xls,.csv" />
                      </label>
                      {files.length > 0 && (
                        <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                          {files.map((f, i) => (
                            <div key={f.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                              <span className="font-bold text-slate-400 text-xs">{i+1}</span>
                              <p className="font-bold text-slate-900 truncate flex-grow">{f.name}</p>
                              <div className="flex gap-1">
                                <button onClick={() => moveFile(i, 'up')} className="p-2"><ChevronUp className="w-4 h-4" /></button>
                                <button onClick={() => removeFile(f.id)} className="p-2 text-red-400"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-2">
                      <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 h-full flex flex-col">
                        <div className="flex-grow space-y-6">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Configuration</label>
                          <input type="text" value={mergeOptions.sheetName} onChange={e => setMergeOptions({...mergeOptions, sheetName: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold" placeholder="Sheet Name" />
                          <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 cursor-pointer">
                            <input type="checkbox" checked={mergeOptions.addSourceColumn} onChange={e => setMergeOptions({...mergeOptions, addSourceColumn: e.target.checked})} className="w-5 h-5 rounded text-slate-900" />
                            <span className="font-bold text-slate-700 text-sm">Include Source Column</span>
                          </label>
                        </div>
                        <div className="mt-10">
                          {results.length === 0 ? (
                            <button onClick={runTool} disabled={files.length === 0 || isProcessing} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg btn-shadow flex items-center justify-center gap-3">
                              {isProcessing ? 'Processing...' : `Merge ${files.length} Files`}
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          ) : (
                            <button onClick={() => { const url = URL.createObjectURL(results[0].blob); const a = document.createElement('a'); a.href = url; a.download = results[0].name; a.click(); }} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-emerald-200">
                              <Download className="w-6 h-6" /> Download Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. INTRODUCTION */}
          <section className="py-24 px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-8">What is MergeExcelFiles.online?</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              MergeExcelFiles.online is a high-performance, web-based utility designed to solve the common headache of manual spreadsheet consolidation. 
              We utilize a client-side engine that processes your Excel and CSV workbooks directly within your browser. 
              This means your sensitive data never touches a remote server, offering bank-grade privacy that cloud-based competitors cannot match.
              Whether you are an accountant, data analyst, or student, our tool provides a streamlined interface for combining data sets instantly.
            </p>
          </section>

          {/* 3. HOW TO USE */}
          <section className="py-24 px-6 bg-slate-50/50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-16 text-center">How to Use the Tool</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: "01", icon: <MousePointer2 />, title: "Select Files", desc: "Drag and drop your XLSX, XLS, or CSV files into the upload zone above." },
                  { step: "02", icon: <Layers />, title: "Arrange Order", desc: "Use the move buttons to define the top-to-bottom order of your merged data." },
                  { step: "03", icon: <Zap />, title: "Download", desc: "Click Merge and instantly save your new combined master spreadsheet." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 card-shadow text-center">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      {item.icon}
                    </div>
                    <div className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">{item.step}</div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. WHY CHOOSE US */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-16 text-center">Why Choose Our Excel Merger?</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-10 rounded-[40px] text-white space-y-4">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  <h3 className="text-2xl font-black">Absolute Privacy</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">Most tools upload your data to a cloud server where it can be stored or compromised. We process everything locally. Your files stay on your device.</p>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 card-shadow space-y-4">
                  <Zap className="w-10 h-10 text-slate-900" />
                  <h3 className="text-2xl font-black">Lightning Performance</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">No upload/download lag. By leveraging your local hardware, we can merge hundreds of files faster than any cloud-based alternative.</p>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-slate-100 card-shadow space-y-4">
                  <FileSpreadsheet className="w-10 h-10 text-slate-900" />
                  <h3 className="text-2xl font-black">Mixed-Format Support</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Need to join a CSV with an XLSX file? Our intelligent converter normalizes all data automatically into a clean Excel structure.</p>
                </div>
                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-200 space-y-4">
                  <Cpu className="w-10 h-10 text-slate-900" />
                  <h3 className="text-2xl font-black">No Installation</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">Get pro-level features without downloading bulky software. Our tool works in any modern browser on Windows, Mac, or Linux.</p>
                </div>
              </div>
            </div>
          </section>

          {/* 5. TOOL COMPARISON */}
          <section className="py-24 px-6 bg-slate-900 text-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black tracking-tighter mb-12 text-center">Comparison: Local vs. Cloud Merging</h2>
              <div className="overflow-hidden border border-slate-800 rounded-3xl">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-800/50">
                      <th className="p-6 font-black uppercase text-xs tracking-widest text-slate-400">Feature</th>
                      <th className="p-6 font-black uppercase text-xs tracking-widest text-emerald-400">MergeExcelFiles.online</th>
                      <th className="p-6 font-black uppercase text-xs tracking-widest text-slate-400">Cloud Competitors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm font-bold">
                    <tr><td className="p-6">Data Privacy</td><td className="p-6 text-emerald-400">100% Local</td><td className="p-6">Risky Cloud Upload</td></tr>
                    <tr><td className="p-6">Processing Speed</td><td className="p-6 text-emerald-400">Instant (Local CPU)</td><td className="p-6">Queued (Server Speed)</td></tr>
                    <tr><td className="p-6">Offline Mode</td><td className="p-6 text-emerald-400">Yes (Once Loaded)</td><td className="p-6">No</td></tr>
                    <tr><td className="p-6">File Size Limit</td><td className="p-6 text-emerald-400">Device RAM Dependent</td><td className="p-6">Artificial Limits</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 6. 10 FAQS */}
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {[
                  { q: "Is MergeExcelFiles.online really free?", a: "Yes, our tool is 100% free with no hidden subscription fees or credit systems." },
                  { q: "Is my data safe with a local merger?", a: "Absolutely. Since your data is processed only in your browser's memory and never sent to a server, it is the safest way to handle confidential files." },
                  { q: "Which formats can I merge?", a: "You can merge .xlsx, .xls, and .csv files interchangeably." },
                  { q: "Is there a limit to how many files I can merge?", a: "No, you can select as many files as you need, provided your computer has enough RAM to handle the combined size." },
                  { q: "Can I merge files with different column headers?", a: "Yes. Our engine intelligently combines all unique columns. If column names don't match, they will simply be appended as new columns in the master sheet." },
                  { q: "Do I need to sign up or create an account?", a: "No registration is required. You can start merging as soon as the page loads." },
                  { q: "Does this tool work on Mac?", a: "Yes, it is compatible with all modern browsers (Chrome, Safari, Firefox, Edge) across macOS, Windows, and Linux." },
                  { q: "Can I remove duplicates while merging?", a: "Yes, simply check the 'Deduplicate Data' option in the config panel before clicking merge." },
                  { q: "What happens if a file is corrupted?", a: "The tool will skip corrupted files and notify you. We recommend using valid XLSX or CSV formats." },
                  { q: "How do I contact support for feature requests?", a: "Please email us at support@mergeexcelfiles.online for any feedback or custom requests." }
                ].map((faq, i) => (
                  <details key={i} className="group border border-slate-100 rounded-3xl bg-white p-6 cursor-pointer hover:border-slate-300 transition-all">
                    <summary className="font-black text-slate-900 list-none flex justify-between items-center group-open:mb-4">
                      {faq.q} <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="text-slate-500 font-medium leading-relaxed text-sm">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER (SquareFace Pattern - Unchanged Layout) */}
      <footer className="bg-slate-900 text-white py-16 px-6 text-center">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-black tracking-tighter uppercase">MergeExcelFiles<span className="text-slate-500">.online</span></span>
            </div>
            <div className="text-slate-400 font-bold text-sm tracking-tight max-w-xl mx-auto">
              © {new Date().getFullYear()} MergeExcelFiles.online. Combine XLSX and CSV spreadsheets into a single master workbook securely today!
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs md:text-sm font-black uppercase tracking-[0.1em] text-slate-300">
            <button onClick={() => switchTool('merge')} className="hover:text-emerald-400 transition-colors">Merge Excel Files</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => switchTool('splitter')} className="hover:text-emerald-400 transition-colors">Split Excel Sheets</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => switchTool('excel-to-csv')} className="hover:text-emerald-400 transition-colors">Excel to CSV Converter</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => switchTool('csv-to-excel')} className="hover:text-emerald-400 transition-colors">CSV to Excel Joiner</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => switchTool('json-to-excel')} className="hover:text-emerald-400 transition-colors">JSON to Spreadsheet</button>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500">
            <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <span className="text-slate-800">|</span>
            <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <span className="text-slate-800">|</span>
            <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors">Contact Us</button>
          </div>
          <div className="max-w-4xl mx-auto text-slate-500 text-xs md:text-sm font-medium leading-relaxed opacity-60">
            MergeExcelFiles.online is your free online excel merging tool. Our advanced workbook combiner handles large spreadsheets with zero data leakage. 
            Whether you need to merge multiple xlsx files online or split sheets by rows, our browser-based excel processor delivers results without installation. 
            Try our secure csv to excel converter and multi-sheet joiner for professional data management now. We are the top-rated merge utility for data analysts worldwide seeking a private way to combine workbooks.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
