
import React, { useState, useCallback } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  Trash2, 
  Settings, 
  Download, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Plus,
  Info,
  ChevronDown
} from 'lucide-react';
import { FileItem, MergeOptions } from './types';
import { mergeFiles } from './utils/excelProcessor';

const Nav = () => (
  <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <FileSpreadsheet className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
            ExcelMerge Pro
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
        </div>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
      <Icon className="text-indigo-600 w-6 h-6" />
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex justify-between items-center text-left hover:text-indigo-600 transition-colors"
      >
        <span className="font-semibold text-slate-800">{q}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <p className="pb-5 text-slate-500 text-sm leading-relaxed">{a}</p>}
    </div>
  );
};

const App: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [options, setOptions] = useState<MergeOptions>({
    sheetName: 'Merged Data',
    removeDuplicates: false,
    addSourceColumn: true
  });

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
      setMergedBlob(null);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setIsMerging(true);
    try {
      const blob = await mergeFiles(files, options);
      setMergedBlob(blob);
    } catch (err) {
      console.error(err);
      alert("Error processing files. Ensure they are valid Excel or CSV files.");
    } finally {
      setIsMerging(false);
    }
  };

  const downloadFile = () => {
    if (!mergedBlob) return;
    const url = URL.createObjectURL(mergedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merged_spreadsheet_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen hero-gradient">
      <Nav />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" />
            Browser-Based Processing
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            The Fastest Way to <br />
            <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Merge Excel Files</span>
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Quickly combine multiple XLSX, XLS, and CSV files into a single master sheet. 
            All processing is done locally—your data never leaves your computer.
          </p>
        </div>

        {/* Tool Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[32px] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
            <div className="p-10">
              {/* Dropzone Area */}
              <label className="group relative block cursor-pointer">
                <div className="border-2 border-dashed border-slate-200 group-hover:border-indigo-400 rounded-3xl p-12 transition-all bg-slate-50/50 group-hover:bg-indigo-50/50 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-xl font-bold text-slate-800">Drop files or click to upload</p>
                  <p className="text-sm text-slate-400 mt-2">Maximum privacy: 100% local processing</p>
                  <input 
                    type="file" 
                    multiple 
                    accept=".xlsx,.xls,.csv" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </label>

              {/* File List and Options */}
              {files.length > 0 && (
                <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      Queue <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{files.length}</span>
                    </h3>
                    <button 
                      onClick={() => { setFiles([]); setMergedBlob(null); }}
                      className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                    >
                      Remove All
                    </button>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto pr-2 space-y-2 mb-8 custom-scrollbar">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700 truncate max-w-[180px] md:max-w-md">{file.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeFile(file.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Settings Grid */}
                  <div className="bg-slate-50/80 rounded-3xl p-6 border border-slate-100 mb-8">
                    <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold text-sm">
                      <Settings className="w-4 h-4 text-indigo-500" />
                      Merge Configuration
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">New Sheet Name</label>
                        <input 
                          type="text" 
                          value={options.sheetName}
                          onChange={(e) => setOptions(p => ({...p, sheetName: e.target.value}))}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          placeholder="e.g. Master Data"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${options.addSourceColumn ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}>
                            <input 
                              type="checkbox" 
                              checked={options.addSourceColumn}
                              onChange={(e) => setOptions(p => ({...p, addSourceColumn: e.target.checked}))}
                              className="hidden" 
                            />
                            {options.addSourceColumn && <Plus className="w-3 h-3 text-white" strokeWidth={4} />}
                          </div>
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Track source filename</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${options.removeDuplicates ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-200'}`}>
                            <input 
                              type="checkbox" 
                              checked={options.removeDuplicates}
                              onChange={(e) => setOptions(p => ({...p, removeDuplicates: e.target.checked}))}
                              className="hidden" 
                            />
                            {options.removeDuplicates && <Plus className="w-3 h-3 text-white" strokeWidth={4} />}
                          </div>
                          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Auto-remove duplicates</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Main Action */}
                  {!mergedBlob ? (
                    <button 
                      onClick={handleMerge}
                      disabled={isMerging}
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-[20px] shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                      {isMerging ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Merge Files
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={downloadFile}
                        className="py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-[20px] shadow-xl shadow-emerald-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        <Download className="w-5 h-5" />
                        Download Results
                      </button>
                      <button 
                        onClick={() => { setMergedBlob(null); setFiles([]); }}
                        className="py-5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-[20px] transition-all flex items-center justify-center"
                      >
                        Start Over
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!files.length && (
                <div className="mt-8 flex items-center gap-3 justify-center text-slate-400">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-medium">Add at least two files to start merging</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges / Features Section */}
      <section id="features" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 tracking-tight">Powerful, Simple, Secure</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built with modern web technologies to ensure your sensitive data stays exactly where it belongs: with you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={ShieldCheck}
              title="End-to-End Privacy"
              desc="We never see your data. Files are read, parsed, and merged directly in your memory using high-performance JS workers."
            />
            <FeatureCard 
              icon={Zap}
              title="Lightning Performance"
              desc="Optimized for huge datasets. Merge thousands of rows from 10+ workbooks in seconds without breaking a sweat."
            />
            <FeatureCard 
              icon={Globe}
              title="Universal Compatibility"
              desc="Seamlessly combine modern XLSX, legacy XLS, and raw CSV files into one clean, standardized Excel workbook."
            />
          </div>
        </div>
      </section>

      {/* SEO Info Section: How to use */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How to Merge Excel Files in 3 Steps</h2>
            <p className="text-slate-500">The easiest tool to automate your repetitive data entry tasks.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (visible on desktop) */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-slate-200 z-0"></div>
            
            {[
              { n: 1, t: "Upload", d: "Drag and drop your files into the safe zone above." },
              { n: 2, t: "Configure", d: "Set your target sheet name and choose cleanup options." },
              { n: 3, t: "Export", d: "Click merge and download your clean, unified file." }
            ].map((step) => (
              <div key={step.n} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center text-2xl font-black text-indigo-600 shadow-sm mb-6">
                  {step.n}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{step.t}</h3>
                <p className="text-slate-500 text-sm">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Section: FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Common Questions</h2>
            <p className="text-slate-500">Everything you need to know about our merging utility.</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
            <FAQItem 
              q="Is there a limit on the number of files I can merge?"
              a="There's no hard limit, but we recommend merging up to 50 files at once for the best performance. Your browser's memory is the only real constraint."
            />
            <FAQItem 
              q="Does this tool support password-protected files?"
              a="Currently, files must be unprotected to be read by the browser. Please remove passwords before attempting to merge."
            />
            <FAQItem 
              q="What happens if the column headers don't match?"
              a="The tool uses intelligent header mapping. It will create columns for all unique headers found across all files. Rows missing certain columns will simply have empty cells."
            />
            <FAQItem 
              q="Can I use this on my mobile phone?"
              a="Absolutely! ExcelMerge Pro is fully responsive and works on any modern mobile browser, including Safari on iPhone and Chrome on Android."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <FileSpreadsheet className="text-white w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">ExcelMerge Pro</span>
              </div>
              <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
                Empowering data analysts and professionals with secure, local-first web utilities. 
                Making spreadsheet management faster and safer since 2025.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <Globe className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-indigo-400 uppercase tracking-widest text-xs">Resources</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Excel to CSV</li>
                <li className="hover:text-white transition-colors cursor-pointer">CSV to Excel</li>
                <li className="hover:text-white transition-colors cursor-pointer">JSON to Excel</li>
                <li className="hover:text-white transition-colors cursor-pointer">Excel Splitter</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 text-indigo-400 uppercase tracking-widest text-xs">Legal</h4>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">GDPR Compliance</li>
                <li className="hover:text-white transition-colors cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} ExcelMerge Pro. All rights reserved.</p>
            <p>Built with ❤️ by Senior Frontend Team</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
