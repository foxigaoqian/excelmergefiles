
# ExcelMerge Pro 部署指南

该项目是一个纯客户端的 React 应用，可以通过以下方式快速部署。

## 方案 A: 部署到 Vercel (推荐)
1. 将代码上传到 GitHub 仓库。
2. 登录 [Vercel](https://vercel.com/)。
3. 点击 **"Add New"** -> **"Project"**。
4. 导入你的 GitHub 仓库。
5. Vercel 会自动识别并设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. 点击 **Deploy** 即可。

## 方案 B: 部署到 Cloudflare Pages
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2. 进入 **"Workers & Pages"**。
3. 点击 **"Create application"** -> **"Pages"** -> **"Connect to Git"**。
4. 选择你的仓库。
5. 在构建设置中选择：
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. 点击 **Save and Deploy**。

## SEO 优化建议
- 部署后，请在 Cloudflare/Vercel 后台设置一个自定义域名（如 `merge-excel.yourdomain.com`）。
- 确保站点开启了 HTTPS（平台会自动提供 SSL 证书）。
- 提交站点地图 (Sitemap) 到 Google Search Console。
