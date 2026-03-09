# GitHub Multi-Engine Search Site

一个可部署到 GitHub Pages 的静态网站，支持 Google、Bing、百度三列对比搜索。

## 功能

- 点击一次“开始搜索”同时加载 Google / Bing / 百度结果
- 结果按三列展示，便于对比
- 每列提供“新标签打开”兜底链接（当站内嵌入受限时）
- 自适应移动端

## 本地预览

直接双击 `index.html` 即可。

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库（例如 `google-search-site`）。
2. 把本目录文件推送到仓库：

```bash
git add .
git commit -m "feat: add multi-engine search"
git push
```

3. 打开仓库 `Settings` -> `Pages`。
4. `Build and deployment` 里选择：
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)`
5. 保存后等待 1-3 分钟，访问页面：

`https://<你的用户名>.github.io/google-search-site/`
