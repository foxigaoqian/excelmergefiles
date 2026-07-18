import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

execFileSync(process.execPath,['scripts/generate-tool-pages.mjs'],{stdio:'inherit'});
const toolPages=['index.html','merge-excel-files-keep-sheets/index.html','merge-csv-files/index.html','split-excel-by-rows/index.html','excel-to-csv/index.html','csv-to-excel/index.html','json-to-excel/index.html'];
const trustPages=['privacy-policy/index.html','terms/index.html','contact/index.html'];
const allPages=[...toolPages,...trustPages];
const titles=new Set(); const descriptions=new Set();
for(const file of allPages){
 const html=fs.readFileSync(file,'utf8');
 const title=html.match(/<title>([^<]+)<\/title>/i)?.[1];
 const description=html.match(/<meta name="description" content="([^"]+)"/i)?.[1];
 if(!title||!description) throw new Error(`${file}: missing title or description`);
 if(titles.has(title)||descriptions.has(description)) throw new Error(`${file}: duplicate metadata`);
 titles.add(title); descriptions.add(description);
 for(const token of ['rel="canonical"','<h1','application/ld+json']) if(!html.includes(token)) throw new Error(`${file}: missing ${token}`);
}
for(const file of toolPages){
 const html=fs.readFileSync(file,'utf8');
 for(const token of ['Frequently asked questions','id="root"','data-tool=','type="module" src="/index.tsx"']) if(!html.includes(token)) throw new Error(`${file}: missing ${token}`);
 if((html.match(/<h2>/g)||[]).length<3) throw new Error(`${file}: thin static content`);
}
for(const file of trustPages){
 const html=fs.readFileSync(file,'utf8');
 if((html.match(/<h2/g)||[]).length<3) throw new Error(`${file}: trust content is too thin`);
 for(const href of ['/privacy-policy/','/terms/','/contact/']) if(!html.includes(href)) throw new Error(`${file}: missing trust navigation ${href}`);
}
const contact=fs.readFileSync('contact/index.html','utf8');
for(const token of ['mailto:foxigaoqian@gmail.com','Email Support','Do not send private workbooks']) if(!contact.includes(token)) throw new Error(`Contact page missing: ${token}`);
if(/Open GitHub Issues/i.test(contact)) throw new Error('Contact page still uses the old issue button.');
const source=['index.html','ToolApp.tsx','SeoContent.tsx','utils/excelProcessor.ts','types.ts'].map(file=>fs.readFileSync(file,'utf8')).join('\n');
for(const pattern of [/aggregateRating/i,/reviewCount/i,/Data Accuracy Guaranteed/i,/HIPAA/i,/GDPR compliance/i,/Top-rated/i,/NONE Limit/i,/setTimeout\([^)]*800/i,/alert\(/]) if(pattern.test(source)) throw new Error(`Unverifiable claim or poor UX pattern found: ${pattern}`);
const seo=fs.readFileSync('SeoContent.tsx','utf8');
for(const token of ['Append Rows vs Keep Sheets','Common use cases','Troubleshooting','Frequently asked questions']) if(!seo.includes(token)) throw new Error(`SEO content missing: ${token}`);
const app=fs.readFileSync('ToolApp.tsx','utf8');
for(const token of ["'keep-sheets'","'append-rows'",'role="alert"','File contents stay in this browser tab']) if(!app.includes(token)) throw new Error(`Tool interface missing: ${token}`);
const processor=fs.readFileSync('utils/excelProcessor.ts','utf8');
for(const token of ["options.mode === 'keep-sheets'",'__Source_Sheet','first worksheet']) if(!processor.includes(token)) throw new Error(`Processor missing behavior: ${token}`);
const sitemap=fs.readFileSync('public/sitemap.xml','utf8');
for(const file of allPages){const route=file==='index.html'?'/':`/${path.dirname(file)}/`;if(!sitemap.includes(`https://www.mergeexcelfiles.online${route}`)) throw new Error(`Sitemap missing ${route}`);}
const entry=fs.readFileSync('index.tsx','utf8');
for(const href of ['/privacy-policy/','/terms/','/contact/']) if(!entry.includes(href)) throw new Error(`Footer missing ${href}`);
console.log(`Spreadsheet site audit passed for ${toolPages.length} tools and ${trustPages.length} trust pages.`);