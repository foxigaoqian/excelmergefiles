
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
  Globe,
  Plus,
  Info,
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
  ShieldAlert,
  HardDrive,
  UserCheck,
  BookOpen,
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

// --- Content Data Mapping ---

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
      { q: "What happens if my files have different column headers?", a: "ExcelMerge Pro creates columns for all unique headers found across all your files." },
      { q: "Does the tool support password-protected files?", a: "Currently, no. Please remove the password protection before uploading." },
      { q: "Is the tool free for commercial use?", a: "Absolutely. ExcelMerge Pro is 100% free for both personal and commercial projects." },
      { q: "Will cell formatting be preserved?", a: "We focus on data consolidation. Original cell styles are normalized to ensure a clean master file." },
      { q: "How does 'Remove Duplicates' work?", a: "It scans all columns; if two rows are identical across all fields, only one is kept." },
      { q: "Can I use this tool offline?", a: "Yes. Once loaded, the processing logic works without an active internet connection." },
      { q: "Is it compatible with mobile browsers?", a: "Yes, though large files are best handled on desktop browsers with more RAM." },
      { q: "Is my data GDPR compliant?", a: "Yes, since no data is transmitted or stored, you maintain full control over your data." },
      { q: "Why is local processing better?", a: "It's faster (no uploads) and infinitely more secure (no server-side breaches)." }
    ]
  },
  'excel-to-csv': {
    title: "Excel to CSV Converter",
    subtitle: "Convert complex workbooks into clean, standard CSV files for data processing.",
    intro: "Need your data in a simple format for a database or Python script? Our Excel to CSV tool extracts your data with precision, handling special characters and formatting flawlessly.",
    whyTitle: "Why our Excel to CSV tool?",
    whyDesc: "Standard converters often struggle with non-English characters or large workbooks. Our tool ensures UTF-8 compliance and maximum reliability.",
    features: [
      { icon: FileText, title: "UTF-8 Support", desc: "Native support for international characters and symbols." },
      { icon: Clock, title: "Batch Ready", desc: "Convert multiple sheets in one go with the splitter tool." },
      { icon: CheckCircle2, title: "Validated", desc: "Outputs strictly compliant RFC 4180 CSV files." }
    ],
    steps: [
      { n: 1, t: "Select Excel", d: "Upload your .xlsx or .xls file to the dashboard." },
      { n: 2, t: "Pick Sheet", d: "Choose which sheet you want to transform into CSV." },
      { n: 3, t: "Get CSV", d: "Download your clean text file ready for any system." }
    ],
    tips: [
      "Check for hidden rows that you might not want included in your CSV export.",
      "Use CSV for data imports as it's more universally compatible than Excel.",
      "Ensure your data doesn't have stray commas in values to keep things clean."
    ],
    comparison: [
      { feature: "Encoding", us: "Auto UTF-8", others: "Often ANSI only" },
      { feature: "Delimiter", us: "Standard Comma", others: "Varies by region" },
      { feature: "Privacy", us: "Zero Uploads", others: "Server-side leaks" }
    ],
    faqs: [
      { q: "Does it support UTF-8 encoding?", a: "Yes, we use UTF-8 as the default encoding for maximum character support." },
      { q: "What if my Excel file has multiple sheets?", a: "This tool converts the active sheet. Use the Splitter to separate multiple sheets." },
      { q: "Are there row limits?", a: "No hard software limit. Export millions of rows if your hardware allows." },
      { q: "How are formulas handled?", a: "We export the calculated values of the formulas, not the formulas themselves." },
      { q: "Will dates be converted correctly?", a: "Yes, we attempt to preserve standard ISO date formats or the format visible in the cell." },
      { q: "Is it safe for HIPAA data?", a: "Yes, since no data is sent to our servers, it is safe for sensitive information." },
      { q: "Can I choose a semicolon delimiter?", a: "Currently, we output standard comma CSV. You can search/replace in any text editor." },
      { q: "Do I need to install software?", a: "No, it runs entirely in your modern web browser." },
      { q: "Does it support .xls?", a: "Yes, both legacy .xls and modern .xlsx are fully supported." },
      { q: "Can I use it on mobile?", a: "Yes, though desktop is recommended for performance on large workbooks." }
    ]
  },
  'csv-to-excel': {
    title: "CSV to Excel Converter",
    subtitle: "Turn raw CSV data into professional, formatted Excel workbooks.",
    intro: "Merging raw CSV logs into a readable Excel file has never been easier. Perfect for log analysis, bank statement reconciliation, and data cleaning.",
    whyTitle: "Best-in-class CSV Conversion",
    whyDesc: "We automatically detect delimiters and data types, saving you the manual effort of the 'Import Text' wizard in Excel.",
    features: [
      { icon: MousePointer2, title: "Auto-Detection", desc: "We automatically handle commas, tabs, and semicolons." },
      { icon: Cpu, title: "Type Parsing", desc: "Dates and numbers are correctly identified as Excel types." },
      { icon: Globe, title: "Multi-CSV", desc: "Merge multiple CSV files into one Excel workbook instantly." }
    ],
    steps: [
      { n: 1, t: "Upload CSVs", d: "Select one or many CSV files from your computer." },
      { n: 2, t: "Combine", d: "Choose to put them on one sheet or separate ones." },
      { n: 3, t: "Download", d: "Your professional XLSX file is ready in milliseconds." }
    ],
    tips: [
      "If your data looks garbled, check if the CSV was saved with UTF-8 encoding.",
      "Merge multiple monthly CSV reports into one workbook for easier analysis.",
      "Keep the source column active to know which file each record came from."
    ],
    comparison: [
      { feature: "Auto-Type", us: "Smart Detect", others: "All strings" },
      { feature: "Multi-File", us: "Built-in", others: "One-by-one only" },
      { feature: "Local Power", us: "Browser Only", others: "Snail-speed server" }
    ],
    faqs: [
      { q: "Can I combine multiple CSVs?", a: "Yes! You can take multiple CSV files and merge them into a single unified Excel worksheet." },
      { q: "What delimiters are detected?", a: "Commas, semicolons, tabs, and pipe (|) characters are supported." },
      { q: "Will long numbers be scientific?", a: "We take care to prevent long ID numbers from being corrupted during conversion." },
      { q: "How fast is it?", a: "Near-instant. 10MB typically converts in under a second." },
      { q: "Is there a file size limit?", a: "Only your RAM. We suggest staying under 100MB for the best experience." },
      { q: "Does it work with non-English data?", a: "Yes, UTF-8 encoded CSVs are perfectly supported." },
      { q: "Do you store the files?", a: "No. Once you close the tab, the data is purged from memory." },
      { q: "Can I use it for bulk processing?", a: "Yes, upload as many files as you like in one batch." },
      { q: "Compatible with Google Sheets?", a: "Yes, the .xlsx file can be uploaded directly to Google Sheets." },
      { q: "Will headers be maintained?", a: "Yes, the first row of your CSV becomes the header row in Excel." }
    ]
  },
  'json-to-excel': {
    title: "JSON to Excel",
    subtitle: "Convert API responses and JSON data into structured Excel sheets.",
    intro: "Developers often need to present JSON data to non-technical stakeholders. This tool flattens complex JSON objects into a readable table format.",
    whyTitle: "Data Flattening made Easy",
    whyDesc: "Don't spend hours writing scripts. Paste your JSON and get a table in seconds.",
    features: [
      { icon: FileJson, title: "Auto-Flatten", desc: "Deeply nested objects are flattened into separate columns." },
      { icon: FileCode, title: "Syntax Highlighting", desc: "Easy editing with our built-in JSON editor." },
      { icon: Zap, title: "Direct Paste", desc: "Copy-paste from your API client directly." }
    ],
    steps: [
      { n: 1, t: "Paste JSON", d: "Paste your raw data into our syntax-aware text area." },
      { n: 2, t: "Validate", d: "We check the format to ensure it's a valid JSON array or object." },
      { n: 3, t: "Export", d: "Convert to Excel and share with your team immediately." }
    ],
    tips: [
      "Ensure your JSON is an array of objects for the most predictable table layout.",
      "You can edit the JSON directly in the browser before clicking convert.",
      "Use this for easy documentation of API responses."
    ],
    comparison: [
      { feature: "Nesting", us: "Smart Flattening", others: "JSON string dump" },
      { feature: "Speed", us: "Instant JS", others: "Server overhead" },
      { feature: "Trust", us: "No data logs", others: "API scraping risk" }
    ],
    faqs: [
      { q: "What JSON structure works best?", a: "An array of objects: `[{ \"id\": 1, \"name\": \"test\" }]` is ideal." },
      { q: "Does it handle nested objects?", a: "Yes, we use 'dot notation' (e.g., `user.name`) to flatten nested fields." },
      { q: "Is there a size limit?", a: "For pasting, we recommend under 5MB to avoid text area lag." },
      { q: "What if my JSON is invalid?", a: "The editor has built-in validation to help you fix errors." },
      { q: "Can I convert a single object?", a: "Yes, it will become a single row in the spreadsheet." },
      { q: "Is my API data private?", a: "Yes. Conversion is entirely client-side; no data is sent to our server." },
      { q: "Can I export to CSV?", a: "Convert to Excel first, then use our Excel to CSV tool." },
      { q: "How are internal arrays handled?", a: "Arrays within objects are stringified into a single cell." },
      { q: "Does it support GeoJSON?", a: "Yes, but it will be flattened into a standard table format." },
      { q: "Is it free for developers?", a: "Yes, 100% free with no API keys or limits." }
    ]
  },
  'excel-splitter': {
    title: "Excel Splitter",
    subtitle: "Break down massive workbooks into smaller, manageable chunks.",
    intro: "Working with a 50MB Excel file can be a nightmare. Our splitter helps you divide data by sheet or row count so you can share it easily.",
    whyTitle: "Precision Splitting",
    whyDesc: "Control exactly how your data is divided without losing header information or formatting.",
    features: [
      { icon: Scissors, title: "Sheet Split", desc: "Save every sheet in a workbook as its own separate file." },
      { icon: LayoutGrid, title: "Row Split", desc: "Divide one sheet into multiple files based on row limits." },
      { icon: Download, title: "Bulk Download", desc: "Get all your split files in a single click." }
    ],
    steps: [
      { n: 1, t: "Upload Large File", d: "Select the heavy workbook you want to divide." },
      { n: 2, t: "Set Split Method", d: "Choose to split by sheets or every X number of rows." },
      { n: 3, t: "Download All", d: "Download each part as an individual XLSX file." }
    ],
    tips: [
      "Split files before emailing them to bypass attachment size limits.",
      "Use sheet-splitting to share specific department data from a master file.",
      "Keep row counts consistent for easier re-merging later if needed."
    ],
    comparison: [
      { feature: "Header Persistence", us: "Auto-Retained", others: "Lost on split" },
      { feature: "Processing", us: "In-Browser", others: "Server timeout" },
      { feature: "Cost", us: "Always Free", others: "Paid credits per split" }
    ],
    faqs: [
      { q: "Will headers be saved?", a: "Yes, we replicate the first row (header) in every split file generated." },
      { q: "Can I split by row count?", a: "Yes, specify the max rows per file for custom division." },
      { q: "How many sheets can it handle?", a: "We can split workbooks with hundreds of sheets efficiently." },
      { q: "What is the max input size?", a: "Typically up to 100MB depending on your computer's RAM." },
      { q: "What is the output format?", a: "Standard modern Excel (.xlsx) files." },
      { q: "Can I split CSV files?", a: "Yes, upload a CSV and it will be split into Excel parts." },
      { q: "Does it preserve formulas?", a: "Cross-sheet references may break; we recommend splitting data-only files." },
      { q: "How do I download the results?", a: "We provide a direct download link for all split segments." },
      { q: "Is it secure for PII?", a: "Yes, everything happens locally on your machine." },
      { q: "Can I undo a split?", a: "You can use our Merge tool to combine them back together." }
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
    content: `Merging files is one of the most common tasks in data analysis. Whether you are combining monthly sales reports or aggregating customer feedback from multiple regions, having a unified dataset is crucial. Traditionally, this required complex VBA macros or hours of manual copy-pasting.

### Why ExcelMerge Pro is Different
Our Excel Merger tool simplifies this process by automating the consolidation of XLSX, XLS, and CSV files in one step. Unlike server-side tools, ExcelMerge Pro processes everything in your browser, ensuring your data never leaves your computer.

### Step-by-Step Usage Guide:
1. **Upload your files**: Simply drag and drop all the files you want to combine into the upload zone.
2. **Review your queue**: Ensure all necessary files are listed. You can remove any mistakes using the trash icon.
3. **Configure Settings**: Choose a name for your master sheet. We recommend enabling "Track source filename" so you can easily trace each row back to its original file.
4. **Merge & Download**: Click "Merge All Files" and receive your perfectly unified Excel workbook in seconds.`
  },
  {
    id: 2,
    title: "Excel to CSV: A Complete Guide to Clean Data Exports",
    excerpt: "Need your data in a simple format for a database or script? Discover how to extract data from complex workbooks with precision.",
    date: "June 18, 2025",
    author: "Samantha Lee",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536ad89?auto=format&fit=crop&q=80&w=800",
    content: `CSV (Comma Separated Values) remains the gold standard for data interchange. If you're importing data into SQL databases, Python scripts, or specialized accounting software, you need a clean CSV export.

### Common Pitfalls in Conversion
Most standard converters struggle with international characters (encoding issues) or nested sheets. Our tool solves this by forcing UTF-8 encoding and allowing specific sheet targeting.

### How to use the Excel to CSV Tool:
1. **Selection**: Upload your primary workbook (.xlsx or .xls).
2. **Targeting**: Our tool automatically targets the first sheet. For multiple sheets, we suggest using our Excel Splitter first.
3. **Conversion**: Hit the convert button. The tool will process all numeric formats and dates into standard text representation.
4. **Verification**: Download the result. You now have a clean, RFC 4180 compliant CSV file ready for any system.`
  },
  {
    id: 3,
    title: "How to Successfully Merge Multiple CSV Reports into One Excel File",
    excerpt: "CSV files are lightweight but hard to analyze individually. Learn how to combine dozens of CSVs into a single professional Excel workbook.",
    date: "June 20, 2025",
    author: "Marcus Chen",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    content: `System logs, bank statements, and social media exports are often delivered as a flurry of small CSV files. Analyzing them one by one is impossible.

### The Power of CSV-to-Excel Merging
Our CSV to Excel tool isn't just a converter—it's a consolidator. It allows you to upload an unlimited number of CSV files and outputs a single, multi-row Excel workbook.

### Usage Guide:
1. **Batch Upload**: Select all your CSV files at once.
2. **Smart Detection**: Our engine automatically identifies the delimiter (comma, semicolon, or tab).
3. **Unified View**: By default, the tool combines all CSV data into one long table, preserving the headers from the first file.
4. **Final Export**: Download your .xlsx file. You can now use Excel's powerful sorting, filtering, and pivoting features on your combined dataset.`
  },
  {
    id: 4,
    title: "Transforming JSON APIs into Readable Spreadsheets",
    excerpt: "Developers and analysts often clash over JSON data. Bridge the gap by converting complex JSON structures into clean Excel tables.",
    date: "June 22, 2025",
    author: "Devin Smith",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    content: `JSON is the language of the modern web, but it's not the language of the boardroom. When stakeholders need to see API data, they want to see it in a spreadsheet.

### Handling Nested Data
The biggest challenge with JSON is nesting (objects within objects). Our JSON to Excel tool uses smart "dot notation" to flatten these structures. For example, a "user" object with a "name" property becomes a simple "user.name" column.

### Step-by-Step Instructions:
1. **Input**: Paste your raw JSON data into our syntax-highlighted editor.
2. **Validation**: The editor will alert you if your JSON is malformed (missing brackets, trailing commas, etc.).
3. **Flat Mapping**: The tool iterates through your objects and creates a column for every unique key found.
4. **Share**: Download the Excel file and share it with your non-technical team members. They'll appreciate the readability!`
  },
  {
    id: 5,
    title: "Mastering the Excel Splitter: How to Divide Massive Files",
    excerpt: "Is your Excel workbook too big to email? Learn how to divide and conquer large workbooks by splitting them into smaller parts.",
    date: "June 25, 2025",
    author: "Sarah J.",
    image: "https://images.unsplash.com/photo-1454165833767-027ffea10c3b?auto=format&fit=crop&q=80&w=800",
    content: `Large Excel files are slow, crash-prone, and impossible to share via email. The solution is splitting the data into smaller, manageable chunks.

### Two Ways to Split
Our tool offers two distinct splitting modes to suit your specific needs:
- **By Sheet**: Every sheet in your workbook becomes its own separate .xlsx file.
- **By Row Count**: Divide a single sheet into multiple files every 500, 1000, or 5000 rows.

### Usage Instructions:
1. **Upload**: Select the massive workbook you want to divide.
2. **Choose Method**: Select either "Sheet Split" or "Row Split" based on your goal.
3. **Header Protection**: Our splitter automatically detects your header row and replicates it in every single output file, ensuring your data remains valid.
4. **Download All**: Receive your files in a batch. No more waiting for slow uploads or dealing with server timeouts.`
  }
];

// --- Reusable UI Sections ---

const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0 group">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-indigo-600 transition-colors focus:outline-none"
      >
        <span className="font-bold text-slate-800 text-lg pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-indigo-500' : 'text-slate-400'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-slate-500 text-base leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

const TipsGrid = ({ tips }: { tips: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {tips.map((tip, i) => (
      <div key={i} className="flex gap-4 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
        <Lightbulb className="w-6 h-6 text-indigo-500 shrink-0" />
        <p className="text-sm font-medium text-slate-700 leading-relaxed">{tip}</p>
      </div>
    ))}
  </div>
);

const ComparisonTable = ({ data }: { data: ToolContent['comparison'] }) => (
  <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
    <table className="w-full text-left bg-white border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          <th className="p-4 text-xs font-black uppercase tracking-widest text-slate-400">Features</th>
          <th className="p-4 text-sm font-bold text-indigo-600">ExcelMerge Pro</th>
          <th className="p-4 text-xs font-bold text-slate-400">Other Tools</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
            <td className="p-4 text-sm font-semibold text-slate-700">{row.feature}</td>
            <td className="p-4 text-sm text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {row.us}
              </div>
            </td>
            <td className="p-4 text-sm text-slate-400">{row.others}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- Navigation ---

const Nav = ({ setView, currentView }: { setView: (v: PageView) => void, currentView: PageView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { id: 'excel-to-csv', label: 'Excel to CSV' },
    { id: 'csv-to-excel', label: 'CSV to Excel' },
    { id: 'json-to-excel', label: 'JSON to Excel' },
    { id: 'excel-splitter', label: 'Splitter' },
    { id: 'blog', label: 'Blog' }
  ];

  const handleNav = (viewId: PageView) => {
    setView(viewId);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => handleNav('home')}
          >
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-all duration-300">
              <FileSpreadsheet className="text-white w-7 h-7" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-800 tracking-tight">
              ExcelMerge Pro
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            {navItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleNav(item.id as PageView)} 
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-emerald-50 relative group
                  ${currentView === item.id ? 'text-emerald-700 bg-emerald-50/50' : 'text-slate-500 hover:text-emerald-600'}`}
              >
                {item.label}
                {currentView === item.id && (
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="lg:hidden p-2 text-slate-500 hover:text-emerald-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white py-4 px-6 space-y-2 animate-in slide-in-from-top-4 duration-300 shadow-xl">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleNav(item.id as PageView)} 
              className={`w-full text-left px-5 py-4 rounded-2xl text-lg font-black transition-all
                ${currentView === item.id ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const Footer = ({ setView }: { setView: (v: PageView) => void }) => {
  const tools = [
    { id: 'home', label: 'Excel Merger' },
    { id: 'excel-to-csv', label: 'Excel to CSV Converter' },
    { id: 'csv-to-excel', label: 'CSV to Excel Merger' },
    { id: 'json-to-excel', label: 'JSON to Excel Utility' },
    { id: 'excel-splitter', label: 'Excel File Splitter' }
  ];

  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-10">
        <p className="text-slate-200 font-bold text-lg md:text-xl">
          © {new Date().getFullYear()} ExcelMerge Pro. Create your perfect master spreadsheet with our local-first excel merger today!
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-slate-300 font-medium">
          {tools.map((tool, index) => (
            <React.Fragment key={tool.id}>
              <button 
                onClick={() => { setView(tool.id as PageView); window.scrollTo(0, 0); }}
                className="hover:text-emerald-400 transition-colors"
              >
                {tool.label}
              </button>
              {index < tools.length - 1 && <span className="text-slate-600">|</span>}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 text-slate-200 font-black italic">
          <button onClick={() => { setView('privacy'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">Privacy Policy</button>
          <span className="text-slate-700">|</span>
          <button onClick={() => { setView('terms'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">Terms of Service</button>
          <span className="text-slate-700">|</span>
          <button className="hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">Contact Us</button>
        </div>

        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-4xl mx-auto font-medium">
          ExcelMerge Pro is your free online excel merger and spreadsheet utility. Our local-first excel merger 
          creates perfect master sheets like excel merge pro. Try our excel to csv converter and csv to excel 
          merger to streamline your data workflow. Our excel file splitter helps manage large datasets with ease. 
          Combine XLSX, XLS, and CSV files instantly with our square-architected (metaphorically) 
          local processing engine. Try our secure excel merger and converter suite now!
        </p>
      </div>
    </footer>
  );
};

// --- Main App Component ---

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

  const content = PAGE_CONTENT[view === 'home' || view.includes('-') ? (view === 'home' ? 'home' : view) : 'home'];

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

  const handleExcelToCSV = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const item = files[0];
      const data = await item.file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      setResult({ blob, name: item.name.replace(/\.[^/.]+$/, "") + ".csv" });
    } catch (err) {
      alert("Error converting file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJSONToExcel = async () => {
    const jsonStr = (document.getElementById('json-input') as HTMLTextAreaElement).value;
    if (!jsonStr) return;
    setIsProcessing(true);
    try {
      const data = JSON.parse(jsonStr);
      const worksheet = XLSX.utils.json_to_sheet(Array.isArray(data) ? data : [data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "JSON Data");
      const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      setResult({ blob: new Blob([wbout]), name: "json_converted.xlsx" });
    } catch (err) {
      alert("Invalid JSON format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplitter = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const item = files[0];
      const data = await item.file.arrayBuffer();
      const workbook = XLSX.read(data);
      const newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, workbook.Sheets[workbook.SheetNames[0]], "Sheet1");
      const wbout = XLSX.write(newWb, { bookType: 'xlsx', type: 'array' });
      setResult({ blob: new Blob([wbout]), name: `split_${workbook.SheetNames[0]}.xlsx` });
    } catch (err) {
      alert("Error splitting file.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.name;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderToolSpecificInterface = () => {
    switch(view) {
      case 'excel-to-csv':
        return (
          <div className="space-y-8">
            <label className="group relative block cursor-pointer">
              <div className="border-3 border-dashed border-slate-200 group-hover:border-emerald-400 rounded-3xl p-16 transition-all bg-slate-50/50 group-hover:bg-emerald-50/50 flex flex-col items-center justify-center text-center">
                <FileText className="w-12 h-12 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-black text-slate-800">{files.length > 0 ? files[0].name : "Upload Excel File"}</p>
                <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </label>
            {files.length > 0 && !result && (
              <button onClick={handleExcelToCSV} disabled={isProcessing} className="w-full py-6 bg-emerald-600 text-white font-black rounded-3xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center text-lg gap-3">
                {isProcessing ? "Converting..." : "Convert to CSV Now"}
              </button>
            )}
            {result && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={downloadResult} className="py-6 bg-emerald-500 text-white font-black rounded-3xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                  <Download className="w-6 h-6" /> Download Result
                </button>
                <button onClick={clear} className="py-6 bg-slate-100 text-slate-600 font-bold rounded-3xl hover:bg-slate-200 transition-all">Upload New</button>
              </div>
            )}
          </div>
        );
      case 'csv-to-excel':
        return (
          <div className="space-y-8">
            <label className="group relative block cursor-pointer">
              <div className="border-3 border-dashed border-slate-200 group-hover:border-emerald-400 rounded-3xl p-16 transition-all bg-slate-50/50 group-hover:bg-emerald-50/50 flex flex-col items-center justify-center text-center">
                <Upload className="w-12 h-12 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-black text-slate-800">{files.length > 0 ? `${files.length} CSV Files` : "Drop CSV Files"}</p>
                <input type="file" multiple accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </label>
            {files.length > 0 && !result && (
              <button onClick={handleMergeAction} disabled={isProcessing} className="w-full py-6 bg-emerald-600 text-white font-black rounded-3xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center text-lg gap-3">
                {isProcessing ? "Processing..." : "Create Excel Workbook"}
              </button>
            )}
            {result && (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={downloadResult} className="py-6 bg-emerald-500 text-white font-black rounded-3xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3">
                  <Download className="w-5 h-5" /> Download
                </button>
                <button onClick={clear} className="py-6 bg-slate-100 text-slate-600 font-bold rounded-3xl hover:bg-slate-200 transition-all">Reset</button>
              </div>
            )}
          </div>
        );
      case 'json-to-excel':
        return (
          <div className="space-y-6">
            <textarea id="json-input" className="w-full h-64 p-6 border-2 border-slate-100 rounded-3xl font-mono text-sm focus:ring-4 focus:ring-emerald-100 outline-none shadow-inner bg-slate-50/30" placeholder='[{"name": "Alice"}, {"name": "Bob"}]'></textarea>
            {!result ? (
              <button onClick={handleJSONToExcel} disabled={isProcessing} className="w-full py-6 bg-emerald-600 text-white font-black rounded-3xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center text-lg gap-3">
                <FileJson className="w-6 h-6" /> Convert to Excel
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={downloadResult} className="py-6 bg-emerald-500 text-white font-black rounded-3xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>
                <button onClick={clear} className="py-6 bg-slate-100 text-slate-600 font-bold rounded-3xl hover:bg-slate-200 transition-all">Clear</button>
              </div>
            )}
          </div>
        );
      case 'excel-splitter':
        return (
          <div className="space-y-8">
             <label className="group relative block cursor-pointer">
              <div className="border-3 border-dashed border-slate-200 group-hover:border-emerald-400 rounded-3xl p-16 transition-all bg-slate-50/50 group-hover:bg-emerald-50/50 flex flex-col items-center justify-center text-center">
                <Scissors className="w-12 h-12 text-emerald-500 mb-6 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-black text-slate-800">{files.length > 0 ? files[0].name : "Upload Excel to Split"}</p>
                <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </label>
            {files.length > 0 && !result && (
              <button onClick={handleSplitter} disabled={isProcessing} className="w-full py-6 bg-emerald-600 text-white font-black rounded-3xl shadow-2xl hover:bg-emerald-700 transition-all flex items-center justify-center text-lg gap-3">
                <Scissors className="w-6 h-6" /> Split by Sheets
              </button>
            )}
            {result && (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={downloadResult} className="py-6 bg-emerald-500 text-white font-black rounded-3xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"><Download className="w-5 h-5" /> Download</button>
                <button onClick={clear} className="py-6 bg-slate-100 text-slate-600 font-bold rounded-3xl hover:bg-slate-200 transition-all">New Split</button>
              </div>
            )}
          </div>
        );
      default: // HOME
        return (
          <div className="p-2 md:p-10">
            <label className="group relative block cursor-pointer">
              <div className="border-3 border-dashed border-slate-200 group-hover:border-emerald-400 rounded-3xl p-12 md:p-20 transition-all bg-slate-50/50 group-hover:bg-emerald-50/50 flex flex-col items-center justify-center text-center">
                <Upload className="w-16 h-16 text-emerald-500 mb-8 group-hover:scale-110 transition-transform" />
                <p className="text-2xl md:text-3xl font-black text-slate-800">Drop files or click to upload</p>
                <p className="text-slate-400 mt-4 text-lg font-medium italic">Supports XLSX, XLS, and CSV</p>
                <input type="file" multiple accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </label>

            {files.length > 0 && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                    Queue 
                    <span className="bg-emerald-100 text-emerald-600 text-sm px-3 py-1 rounded-full">{files.length}</span>
                  </h3>
                  <button onClick={clear} className="text-sm text-slate-400 hover:text-red-500 transition-colors font-black uppercase tracking-widest">Remove All</button>
                </div>
                
                <div className="max-h-72 overflow-y-auto pr-2 space-y-3 mb-10 custom-scrollbar">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                          <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="truncate max-w-[200px] md:max-w-md">
                          <p className="text-base font-bold text-slate-800">{file.name}</p>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button onClick={() => setFiles(f => f.filter(fi => fi.id !== file.id))} className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50/80 rounded-[40px] p-8 border border-slate-100 mb-10">
                  <div className="flex items-center gap-3 mb-8 text-slate-800 font-black text-lg">
                    <Settings className="w-6 h-6 text-emerald-500" />
                    Merge Settings
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Master Sheet Name</label>
                      <input 
                        type="text" 
                        value={options.sheetName} 
                        onChange={(e) => setOptions(p => ({...p, sheetName: e.target.value}))} 
                        className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-lg font-bold outline-none focus:ring-4 focus:ring-emerald-100 transition-all"
                      />
                    </div>
                    <div className="space-y-5 flex flex-col justify-center">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <input type="checkbox" checked={options.addSourceColumn} onChange={(e) => setOptions(p => ({...p, addSourceColumn: e.target.checked}))} className="w-6 h-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-lg font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Track source filename</span>
                      </label>
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <input type="checkbox" checked={options.removeDuplicates} onChange={(e) => setOptions(p => ({...p, removeDuplicates: e.target.checked}))} className="w-6 h-6 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                        <span className="text-lg font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Unique rows only</span>
                      </label>
                    </div>
                  </div>
                </div>

                {!result ? (
                  <button onClick={handleMergeAction} disabled={isProcessing} className="w-full py-8 bg-emerald-600 text-white font-black text-2xl rounded-3xl shadow-2xl hover:bg-emerald-700 hover:scale-[1.01] transition-all flex items-center justify-center gap-4">
                    {isProcessing ? "Processing..." : "Merge All Files"} 
                    {!isProcessing && <ArrowRight className="w-8 h-8" />}
                  </button>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <button onClick={downloadResult} className="py-8 bg-emerald-500 text-white font-black text-2xl rounded-3xl shadow-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-4">
                      <Download className="w-8 h-8" /> Download Excel
                    </button>
                    <button onClick={clear} className="py-8 bg-slate-100 text-slate-600 font-black text-2xl rounded-3xl hover:bg-slate-200 transition-all">Reset</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  const renderView = () => {
    if (view === 'privacy') {
      return (
        <div className="py-12 md:py-24 max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 p-8 md:p-20">
            <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">Privacy Policy</h1>
            <div className="prose prose-slate max-w-none text-slate-600 text-lg font-medium leading-relaxed space-y-8">
              <p>At ExcelMerge Pro, accessible from https://mergeexcelfiles.online, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ExcelMerge Pro and how we use it.</p>
              
              <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at foxigaoqian@gmail.com.</p>
              
              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Log Files</h2>
              <p>ExcelMerge Pro follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Cookies and Web Beacons</h2>
              <p>Like any other website, ExcelMerge Pro uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Local Processing Notice</h2>
              <p>ExcelMerge Pro is a local-first utility. This means that any spreadsheet data, Excel files, or CSV records you process using our tools are handled entirely within your browser's memory. We do not upload your data to our servers, and we do not store your private business information. Your files stay on your machine.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Privacy Policies</h2>
              <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on ExcelMerge Pro, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
              <p>Note that ExcelMerge Pro has no access to or control over these cookies that are used by third-party advertisers.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Third Party Privacy Policies</h2>
              <p>ExcelMerge Pro's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Children's Information</h2>
              <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.</p>
              <p>ExcelMerge Pro does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Online Privacy Policy Only</h2>
              <p>This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in ExcelMerge Pro. This policy is not applicable to any information collected offline or via channels other than this website.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Consent</h2>
              <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'terms') {
      return (
        <div className="py-12 md:py-24 max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 p-8 md:p-20">
            <h1 className="text-5xl font-black text-slate-900 mb-12 tracking-tighter">Terms and Conditions</h1>
            <div className="prose prose-slate max-w-none text-slate-600 text-lg font-medium leading-relaxed space-y-8">
              <p>Welcome to mergeexcelfiles.online!</p>
              <p>These terms and conditions outline the rules and regulations for the use of mergeexcelfiles.online's Website, located at https://mergeexcelfiles.online.</p>
              <p>By accessing this website we assume you accept these terms and conditions. Do not continue to use mergeexcelfiles.online if you do not agree to take all of the terms and conditions stated on this page.</p>
              
              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Cookies</h2>
              <p>We employ the use of cookies. By accessing mergeexcelfiles.online, you agreed to use cookies in agreement with the mergeexcelfiles.online's Privacy Policy.</p>
              <p>Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">License</h2>
              <p>Unless otherwise stated, mergeexcelfiles.online and/or its licensors own the intellectual property rights for all material on mergeexcelfiles.online. All intellectual property rights are reserved. You may access this from mergeexcelfiles.online for your own personal use subjected to restrictions set in these terms and conditions.</p>
              <p>You must not:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Republish material from mergeexcelfiles.online</li>
                <li>Sell, rent or sub-license material from mergeexcelfiles.online</li>
                <li>Reproduce, duplicate or copy material from mergeexcelfiles.online</li>
                <li>Redistribute content from mergeexcelfiles.online</li>
              </ul>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Hyperlinking to our Content</h2>
              <p>The following organizations may link to our Website without prior written approval:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Government agencies;</li>
                <li>Search engines;</li>
                <li>News organizations;</li>
                <li>Online directory distributors may link to our Website in the same manner as they hyperlink to the Websites of other listed businesses; and</li>
                <li>System wide Accredited Businesses except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our Web site.</li>
              </ul>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">iFrames</h2>
              <p>Without prior approval and written permission, you may not create frames around our Webpages that alter in any way the visual presentation or appearance of our Website.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Content Liability</h2>
              <p>We shall not be hold responsible for any content that appears on your Website. You agree to protect and defend us against all claims that is rising on your Website. No link(s) should appear on any Website that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or advocates the infringement or other violation of, any third party rights.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Reservation of Rights</h2>
              <p>We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Removal of links from our website</h2>
              <p>If you find any link on our Website that is offensive for any reason, you are free to contact and inform us at any moment at foxigaoqian@gmail.com. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.</p>

              <h2 className="text-2xl font-black text-slate-800 mt-12 mb-4">Disclaimer</h2>
              <p>To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>limit or exclude our or your liability for death or personal injury;</li>
                <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
                <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
                <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
              </ul>
              <p>As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.</p>
            </div>
          </div>
        </div>
      );
    }

    if (['gdpr', 'cookie'].includes(view)) {
      return (
        <div className="py-24 max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-[48px] shadow-2xl border border-slate-100 p-12 md:p-20">
            <h1 className="text-5xl font-black text-slate-900 mb-12 capitalize tracking-tighter">{view} Policy</h1>
            <div className="prose prose-slate max-w-none text-slate-600 text-lg font-medium leading-relaxed">
              <p>Your satisfaction and legal safety are our priorities. We are currently finalizing the full text for our {view} documentation to ensure it meets the highest standards of clarity and compliance.</p>
              <p className="mt-6">In the meantime, rest assured that mergeexcelfiles.online is built on a "Privacy by Design" principle. All data processing occurs locally on your device, and no user spreadsheets are ever transmitted to our servers.</p>
              <p className="mt-6">For urgent inquiries regarding our {view} practices, please contact us at foxigaoqian@gmail.com.</p>
            </div>
          </div>
        </div>
      );
    }

    if (view === 'blog') {
      const selectedPost = BLOG_POSTS.find(p => p.id === selectedPostId);

      if (selectedPost) {
        return (
          <div className="py-12 md:py-24 px-4 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setSelectedPostId(null)}
              className="flex items-center gap-2 text-emerald-600 font-black mb-12 hover:translate-x-[-4px] transition-transform"
            >
              <ArrowLeft className="w-5 h-5" /> Back to Blog
            </button>
            <article className="bg-white rounded-[48px] border border-slate-100 shadow-2xl overflow-hidden">
              <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-80 object-cover" />
              <div className="p-8 md:p-16">
                <div className="flex items-center gap-4 text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {selectedPost.date}</span>
                  <span className="flex items-center gap-2"><User className="w-4 h-4" /> {selectedPost.author}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight tracking-tight">
                  {selectedPost.title}
                </h1>
                <div className="prose prose-slate max-w-none prose-lg prose-emerald prose-headings:font-black prose-headings:tracking-tight prose-p:leading-loose">
                  {selectedPost.content.split('\n').map((para, i) => (
                    para.startsWith('###') ? 
                      <h3 key={i} className="text-2xl font-black text-slate-800 mt-12 mb-6">{para.replace('###', '')}</h3> :
                    para.startsWith('1.') || para.startsWith('2.') || para.startsWith('3.') || para.startsWith('4.') ?
                      <div key={i} className="flex gap-4 mb-4">
                        <span className="font-black text-emerald-600">{para.split(' ')[0]}</span>
                        <p className="font-medium text-slate-600">{para.split(' ').slice(1).join(' ')}</p>
                      </div> :
                    para.startsWith('-') ?
                      <li key={i} className="list-disc ml-6 text-slate-600 mb-2 font-medium">{para.replace('-', '').trim()}</li> :
                      <p key={i} className="text-slate-600 mb-6 whitespace-pre-line font-medium leading-relaxed">{para}</p>
                  ))}
                </div>
                <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center font-black text-emerald-600">
                        {selectedPost.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{selectedPost.author}</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Author</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => { setView('home'); window.scrollTo(0, 0); }}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
                   >
                    Try Tool Now
                   </button>
                </div>
              </div>
            </article>
          </div>
        );
      }

      return (
        <div className="space-y-24">
          <section className="pt-24 pb-16 px-4">
            <div className="max-w-5xl mx-auto text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">Data <span className="text-emerald-600">Blog</span></h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">Expert tips and guides for ExcelMerge Pro power users.</p>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              {BLOG_POSTS.map((post) => (
                <article 
                  key={post.id} 
                  onClick={() => { setSelectedPostId(post.id); window.scrollTo(0, 0); }}
                  className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all group cursor-pointer"
                >
                  <div className="h-56 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-8">
                    <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-3">{post.date}</div>
                    <h2 className="text-2xl font-black text-slate-800 mb-4 leading-tight group-hover:text-emerald-600 transition-colors">{post.title}</h2>
                    <p className="text-slate-500 mb-6 leading-relaxed line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">Read Full Guide <ArrowRight className="w-4 h-4" /></div>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <FAQSection faqs={PAGE_CONTENT.home.faqs} />
        </div>
      );
    }

    return (
      <div className="space-y-16 md:space-y-24">
        <section className="pt-16 pb-16 px-4">
          <div className="max-w-5xl mx-auto text-center mb-10">
            {/* Tool Icon - Refined rounded square style */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center border border-slate-100 transition-transform hover:scale-105">
                <FileSpreadsheet className="w-9 h-9 text-emerald-500" />
              </div>
            </div>

            {/* Badge - Match screenshot colors */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#f0f3ff] text-slate-700 text-xs font-bold mb-8 border border-[#e0e7ff] shadow-sm">
              100% Free • No Registration Required
            </div>

            {/* Main Title - Specific Green to Brown to Orange gradient */}
            <h1 className="text-5xl md:text-[92px] font-black mb-10 tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-r from-[#00966d] via-[#858b29] to-[#f2711c]">
              {content.title}
            </h1>

            {/* Subtitle - Grey/Slate with comfortable width */}
            <p className="text-lg md:text-[22px] text-slate-500 max-w-[860px] mx-auto font-medium leading-[1.6] mb-12">
              {content.subtitle}
            </p>

            {/* Feature Highlights - Centered checkmarks */}
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-slate-600 font-bold text-[17px]">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> No file size limits
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> Multiple file formats
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} /> 100% secure & private
              </div>
            </div>
          </div>

          {/* Main Upload Area */}
          <div className="max-w-4xl mx-auto mt-20">
            <div className="bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
              <div className="p-4 md:p-14">
                {renderToolSpecificInterface()}
              </div>
            </div>
          </div>
        </section>

        {/* Home Specific Sections */}
        <section className="py-24 px-4 bg-white border-y border-slate-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Introduction to {content.title}</h2>
            <p className="text-lg text-slate-500 leading-loose mb-10">{content.intro}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="bg-slate-50 p-12 rounded-[40px] border border-slate-100 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center"><FileSpreadsheet className="w-10 h-10 text-emerald-500" /></div>
                  <div className="w-20 h-20 bg-emerald-500 rounded-3xl shadow-sm flex items-center justify-center"><ArrowRight className="w-10 h-10 text-white" /></div>
                  <div className="w-20 h-20 bg-slate-200 rounded-3xl shadow-sm flex items-center justify-center"><Download className="w-10 h-10 text-slate-400" /></div>
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center"><FileText className="w-10 h-10 text-emerald-500" /></div>
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-slate-900">{content.whyTitle}</h3>
                <p className="text-lg text-slate-500">{content.whyDesc}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-black text-slate-900 mb-6">How to Use the Tool</h2>
              <p className="text-xl text-slate-500">Process your spreadsheets in three simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-emerald-50 z-0"></div>
              {content.steps.map((step) => (
                <div key={step.n} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="w-24 h-24 bg-white border-8 border-emerald-50 rounded-full flex items-center justify-center text-3xl font-black text-emerald-600 shadow-xl mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    {step.n}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-4">{step.t}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-slate-900 text-white rounded-[64px] mx-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {content.features.map((f, i) => (
                <div key={i} className="bg-slate-800 p-10 rounded-[40px] border border-slate-700">
                  <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8"><f.icon className="w-8 h-8 text-white" /></div>
                  <h3 className="text-2xl font-black mb-4">{f.title}</h3>
                  <p className="text-slate-400 leading-loose">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-white border-y border-slate-100">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-6">Usage Tips</h2>
              <p className="text-lg text-slate-500">Master your workflow with these professional insights.</p>
            </div>
            <TipsGrid tips={content.tips} />
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-slate-900 mb-6">Advantage over Others</h2>
              <p className="text-lg text-slate-500">A direct comparison of capabilities.</p>
            </div>
            <ComparisonTable data={content.comparison} />
          </div>
        </section>

        <FAQSection faqs={content.faqs} />
      </div>
    );
  };

  const FAQSection = ({ faqs }: { faqs: ToolContent['faqs'] }) => (
    <section id="faq" className="py-24 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-500">Everything you need to know about our browser-based utility.</p>
        </div>
        <div className="bg-white rounded-[40px] p-10 md:p-16 border border-slate-100 shadow-xl">
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen hero-gradient">
      <Nav setView={(v) => { setView(v); setSelectedPostId(null); }} currentView={view} />
      <main className="pb-24">
        {renderView()}
      </main>
      <Footer setView={(v) => { setView(v); setSelectedPostId(null); }} />
    </div>
  );
};

export default App;
