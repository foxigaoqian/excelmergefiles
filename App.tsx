
import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, Upload, Trash2, Settings, Download, ArrowRight,
  ShieldCheck, Zap, ChevronDown, MousePointer2, Layers, Cpu, 
  LayoutGrid, ChevronUp, CheckCircle, Menu, X, Lock, Mail,
  BarChart3, ShieldAlert, Globe2, FileText, FileJson, Scissors
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
  }, [view, activeTool]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const isSingleFileTool = ['excel-to-csv', 'csv-to-excel', 'json-to-excel', 'splitter'].includes(activeTool);
      
      const newFiles = Array.from(e.target.files).map((file: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
        status: 'pending' as const
      }));
      
      if (isSingleFileTool) {
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
  };

  const navigateTo = (p: PageView) => {
    setView(p);
    setMobileMenuOpen(false);
  };

  const toolContent = {
    'merge': {
      title: 'Merge Excel Files',
      highlight: 'Without Uploading.',
      desc: 'The most secure online tool to combine multiple XLSX and CSV spreadsheets. Privacy-first processing ensures your data never leaves your computer.',
      button: 'Merge Files'
    },
    'splitter': {
      title: 'Split Excel Sheets',
      highlight: 'Into Smaller Files.',
      desc: 'Break down large workbooks into manageable parts. Perfect for processing huge data sets in chunks without losing cell integrity.',
      button: 'Split Sheet'
    },
    'excel-to-csv': {
      title: 'Excel to CSV',
      highlight: 'Instant Conversion.',
      desc: 'Convert standard XLSX workbooks into universal CSV format. Fast, private, and compatible with all database systems.',
      button: 'Convert to CSV'
    },
    'csv-to-excel': {
      title: 'CSV to Excel',
      highlight: 'Smart Formatting.',
      desc: 'Transform raw CSV files into beautiful Excel spreadsheets. Automatically detects delimiters and handles encoding perfectly.',
      button: 'Convert to Excel'
    },
    'json-to-excel': {
      title: 'JSON to Excel',
      highlight: 'Clean Mapping.',
      desc: 'Turn complex JSON data arrays into readable Excel tables. Ideal for developers needing quick data exports.',
      button: 'Convert JSON'
    }
  };

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

      {/* Conditional Content Views */}
      {view === 'privacy' && <div className="max-w-4xl mx-auto py-20 px-6 animate-in"><h1 className="text-4xl font-black mb-8 text-slate-900 uppercase">Privacy Policy</h1><div className="prose text-slate-600 font-medium space-y-6"><p>At MergeExcelFiles.online, we prioritize your data security above all else. Our tool operates entirely within your browser environment. This means that when you select your spreadsheets, they are read locally by your device's CPU and RAM. We do not transmit, upload, or store your file content on any remote servers. Your privacy is guaranteed by our architecture.</p><button onClick={() => navigateTo('home')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Back to Tool</button></div></div>}
      {view === 'terms' && <div className="max-w-4xl mx-auto py-20 px-6 animate-in"><h1 className="text-4xl font-black mb-8 text-slate-900 uppercase">Terms of Service</h1><div className="prose text-slate-600 font-medium space-y-6"><p>This service is provided free of charge for both individual and commercial use. Users are responsible for ensuring they have backups of their original data before processing. We are not liable for any data loss or corruption. By using this tool, you agree that processing happens locally and results depend on your system performance.</p><button onClick={() => navigateTo('home')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Back to Tool</button></div></div>}
      {view === 'contact' && <div className="max-w-4xl mx-auto py-20 px-6 animate-in text-center"><h1 className="text-4xl font-black mb-8 text-slate-900 uppercase">Contact Support</h1><p className="text-xl text-slate-500 font-bold mb-8">Got questions? Reach out to our technical team.</p><div className="inline-block p-8 bg-slate-50 border border-slate-100 rounded-3xl"><a href="mailto:support@mergeexcelfiles.online" className="text-2xl font-black text-slate-900 hover:text-indigo-600 transition-colors">support@mergeexcelfiles.online</a></div><div className="mt-8"><button onClick={() => navigateTo('home')} className="text-slate-400 font-bold hover:text-slate-900">Return to Homepage</button></div></div>}

      {view === 'home' && (
        <>
          {/* TOOL SECTION */}
          <section className="pt-16 pb-24 px-6 border-b border-slate-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16 animate-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                  <Lock className="w-3 h-3" /> 100% Secure & Client-Side
                </div>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-6">
                  {toolContent[activeTool].title} <br className="hidden md:block" /> 
                  <span className="text-slate-200">{toolContent[activeTool].highlight}</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                  {toolContent[activeTool].desc}
                </p>
              </div>

              {/* Tool Interaction Card */}
              <div className="bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden card-shadow">
                <div className="p-8 md:p-12">
                  <div className="grid lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-3 space-y-6">
                      <label className={`group relative flex flex-col items-center justify-center border-4 border-dashed rounded-[32px] transition-all duration-300 cursor-pointer 
                        ${files.length > 0 ? 'h-40 bg-slate-50 border-slate-200' : 'h-80 bg-slate-50 border-slate-300 hover:border-slate-900 hover:bg-white'}`}>
                        <div className="flex flex-col items-center">
                          <div className={`bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl mb-4 transition-all ${files.length > 0 ? 'w-10 h-10' : 'w-16 h-16'}`}>
                            {activeTool === 'merge' ? <Upload className="text-white w-6 h-6" /> : 
                             activeTool === 'splitter' ? <Scissors className="text-white w-6 h-6" /> :
                             activeTool === 'excel-to-csv' ? <FileText className="text-white w-6 h-6" /> :
                             activeTool === 'csv-to-excel' ? <FileSpreadsheet className="text-white w-6 h-6" /> :
                             <FileJson className="text-white w-6 h-6" />}
                          </div>
                          <span className="font-black text-slate-900 text-xl text-center px-4">
                            {files.length > 0 ? 'File selected' : `Upload ${activeTool === 'merge' ? 'Multiple Files' : 'a File'}`}
                          </span>
                        </div>
                        <input type="file" multiple={activeTool === 'merge'} onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept={activeTool === 'csv-to-excel' ? '.csv' : activeTool === 'json-to-excel' ? '.json' : '.xlsx,.xls,.csv'} />
                      </label>
                      {files.length > 0 && (
                        <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                          {files.map((f, i) => (
                            <div key={f.id} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl group">
                              <span className="font-black text-slate-300 text-xs">{i+1}</span>
                              <p className="font-bold text-slate-900 truncate flex-grow">{f.name}</p>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {activeTool === 'merge' && <button onClick={() => moveFile(i, 'up')} className="p-2 bg-white rounded-lg hover:bg-slate-100 shadow-sm"><ChevronUp className="w-4 h-4" /></button>}
                                <button onClick={() => removeFile(f.id)} className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-400 shadow-sm"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="lg:col-span-2">
                      <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 h-full flex flex-col">
                        <div className="flex-grow space-y-6">
                          {activeTool === 'merge' && (
                            <>
                              <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Project Settings</label>
                                <input type="text" value={mergeOptions.sheetName} onChange={e => setMergeOptions({...mergeOptions, sheetName: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all" placeholder="Sheet Name" />
                              </div>
                              <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all">
                                  <input type="checkbox" checked={mergeOptions.addSourceColumn} onChange={e => setMergeOptions({...mergeOptions, addSourceColumn: e.target.checked})} className="w-5 h-5 rounded text-slate-900 border-slate-300" />
                                  <span className="font-bold text-slate-700 text-sm">Add Filename Column</span>
                                </label>
                                <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 cursor-pointer hover:border-slate-400 transition-all">
                                  <input type="checkbox" checked={mergeOptions.removeDuplicates} onChange={e => setMergeOptions({...mergeOptions, removeDuplicates: e.target.checked})} className="w-5 h-5 rounded text-slate-900 border-slate-300" />
                                  <span className="font-bold text-slate-700 text-sm">Automated Deduplication</span>
                                </label>
                              </div>
                            </>
                          )}
                          {activeTool === 'splitter' && (
                            <div>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Split Every X Rows</label>
                              <input type="number" value={splitOptions.rowsPerFile} onChange={e => setSplitOptions({rowsPerFile: parseInt(e.target.value) || 1000})} className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all" />
                            </div>
                          )}
                          {['excel-to-csv', 'csv-to-excel', 'json-to-excel'].includes(activeTool) && (
                            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Optimized High-Speed Conversion Engine</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-10">
                          {results.length === 0 ? (
                            <button onClick={runTool} disabled={files.length === 0 || isProcessing} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg btn-shadow flex items-center justify-center gap-3 disabled:opacity-50">
                              {isProcessing ? 'Processing...' : toolContent[activeTool].button}
                              <ArrowRight className="w-5 h-5" />
                            </button>
                          ) : (
                            <div className="space-y-3">
                              {results.map((res, i) => (
                                <button key={i} onClick={() => { const url = URL.createObjectURL(res.blob); const a = document.createElement('a'); a.href = url; a.download = res.name; a.click(); }} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-colors">
                                  <Download className="w-6 h-6" /> Download {results.length > 1 ? `Part ${i+1}` : 'Result'}
                                </button>
                              ))}
                              <button onClick={clear} className="w-full py-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900">Start New</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 1. 工具介绍 (Introduction) */}
          <section className="py-24 px-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">Professional Local-First <br/>Data Processing.</h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed mb-6">
                  MergeExcelFiles.online is a high-performance, browser-native utility suite. We utilize the latest client-side technology to ensure your private data remains completely offline during every transformation.
                </p>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-black text-slate-900">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> No Server Logs
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs font-black text-slate-900">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Secure Sandbox
                   </div>
                </div>
              </div>
              <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>
                 <BarChart3 className="w-12 h-12 text-slate-900 mb-6 relative z-10" />
                 <h3 className="text-xl font-black text-slate-900 mb-4 relative z-10">Data Accuracy Guaranteed</h3>
                 <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10">Our engine handles thousands of rows without compromising data types, cell values, or structure. Whether merging, splitting, or converting, your data integrity is our core focus.</p>
              </div>
            </div>
          </section>

          {/* 2. 如何使用工具 (How to Use) */}
          <section className="py-24 px-6 bg-[#fafbfc]">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900">How to Use our Utilities</h2>
                <p className="text-slate-500 font-medium mt-4">Simple, powerful, and intuitive workflow.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-12">
                {[
                  { icon: <MousePointer2 className="w-8 h-8"/>, title: "1. Select File", desc: "Select the spreadsheets you wish to process. You can drag and drop multiple files for the merge tool." },
                  { icon: <Layers className="w-8 h-8"/>, title: "2. Set Options", desc: "Configure how you want your data handled - set sheet names, split points, or deduplication rules." },
                  { icon: <Zap className="w-8 h-8"/>, title: "3. Export Result", desc: "The processing happens instantly in your browser. Download your new files without any waiting time." }
                ].map((step, i) => (
                  <div key={i} className="relative group">
                    <div className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mb-8 card-shadow group-hover:bg-slate-900 group-hover:text-white transition-all">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-4">{step.title}</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                    {i < 2 && <div className="hidden lg:block absolute top-8 -right-4 w-8 h-[2px] bg-slate-100"></div>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. 为什么选择我们这个工具 (Why Choose Us) */}
          <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-white overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px]"></div>
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">Uncompromising Security <br/>for Professional Data.</h2>
                    <ul className="space-y-6">
                      <li className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><ShieldCheck className="w-6 h-6 text-emerald-400" /></div>
                        <div><h4 className="font-black text-lg">Zero Cloud Exposure</h4><p className="text-slate-400 text-sm font-medium">Your private data never touches a server. Perfect for HIPAA or GDPR compliance.</p></div>
                      </li>
                      <li className="flex gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0"><Cpu className="w-6 h-6 text-emerald-400" /></div>
                        <div><h4 className="font-black text-lg">Native CPU Acceleration</h4><p className="text-slate-400 text-sm font-medium">We utilize your local hardware to process thousands of rows in milliseconds.</p></div>
                      </li>
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { l: "Security", v: "100%" },
                      { l: "Speed", v: "FAST" },
                      { l: "Limit", v: "NONE" },
                      { l: "Price", v: "$0" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                        <div className="text-3xl font-black mb-1">{stat.v}</div>
                        <div className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. 对比优势 (Advantages vs Others) */}
          <section className="py-24 px-6 max-w-6xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900">MergeExcelFiles vs. The Rest</h2>
                <p className="text-slate-500 font-medium mt-4">Why local processing wins every single time.</p>
             </div>
             <div className="grid md:grid-cols-2 gap-12">
                <div className="p-10 bg-emerald-50 rounded-[40px] border border-emerald-100">
                   <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-emerald-600" /> Our Advantage
                   </h3>
                   <ul className="space-y-6">
                      <li className="font-bold text-slate-700">✓ No upload time - Instant data access</li>
                      <li className="font-bold text-slate-700">✓ Works offline after page load</li>
                      <li className="font-bold text-slate-700">✓ No file storage risks or data leaks</li>
                      <li className="font-bold text-slate-700">✓ Intelligent mixed format merging</li>
                   </ul>
                </div>
                <div className="p-10 bg-red-50 rounded-[40px] border border-red-100">
                   <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                      <ShieldAlert className="w-6 h-6 text-red-600" /> Traditional Converters
                   </h3>
                   <ul className="space-y-6">
                      <li className="font-bold text-slate-500 line-through">Slow server uploads and latency</li>
                      <li className="font-bold text-slate-500 line-through">Requires constant internet connection</li>
                      <li className="font-bold text-slate-500 line-through">Your files are stored on remote clouds</li>
                      <li className="font-bold text-slate-500 line-through">Restrictive daily file count limits</li>
                   </ul>
                </div>
             </div>
          </section>

          {/* 5. 常见问题 (10 FAQs) */}
          <section className="py-24 px-6 bg-slate-50/30">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-12 text-center">Frequently Asked Questions</h2>
              <div className="grid gap-4">
                {[
                  { q: "How many files can I merge at once?", a: "There is no fixed limit. You can merge as many files as your device's memory can handle. Most modern machines handle hundreds of workbooks effortlessly." },
                  { q: "Is the splitter tool limited to a certain number of rows?", a: "No. You can define any number of rows per file. The tool will iterate through your workbook and generate download links for each part." },
                  { q: "Is my data sent to any cloud server?", a: "Never. All transformations are performed locally in your browser's private sandbox. We do not have any backend that stores or reads your data." },
                  { q: "Can I merge CSV and XLSX files together?", a: "Yes. Our engine normalizes both formats automatically into a single master Excel output." },
                  { q: "Is this tool free for commercial use?", a: "Absolutely. MergeExcelFiles.online is 100% free for everyone, including business professionals and large organizations." },
                  { q: "Does the converter preserve my formatting?", a: "We preserve data values and column structures. Complex macros and some advanced conditional formatting may not transfer during a raw merge." },
                  { q: "What browsers are supported?", a: "All modern browsers including Chrome, Safari, Firefox, and Edge are fully supported." },
                  { q: "Can I use the tool offline?", a: "Yes. Once the website is loaded, all processing logic is stored in your browser, allowing for offline file transformation." },
                  { q: "What is the maximum file size for splitting?", a: "We recommend keeping input files under 150MB for the best browser performance, though larger files can work on high-RAM machines." },
                  { q: "Why is local processing more secure?", a: "Local processing means your data never travels across the public internet to a server, eliminating the risk of interception or storage breaches." }
                ].map((faq, i) => (
                  <details key={i} className="group bg-white border border-slate-100 p-6 rounded-3xl hover:border-slate-300 transition-all cursor-pointer">
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

      {/* FOOTER (SquareFace Pattern) */}
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
