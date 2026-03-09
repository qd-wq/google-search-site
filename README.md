# GitHub Google Search Site

一个可部署到 GitHub Pages 的静态网站，支持通过表单跳转到 Google 搜索结果页。

## 本地预览

直接双击 `index.html` 即可。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库（例如 `google-search-site`）。
2. 把本目录文件推送到仓库：

```bash
git init
git add .
git commit -m "init google search site"
git branch -M main
git remote add origin git@github.com:<你的用户名>/google-search-site.git
git push -u origin main
```

3. 打开仓库 `Settings` -> `Pages`。
4. `Build and deployment` 里选择：
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)`
5. 保存后等待 1-3 分钟，访问页面：

`https://<你的用户名>.github.io/google-search-site/`
