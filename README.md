# GitHub Multi-Engine Search Site

一个可部署到 GitHub Pages 的静态网站，支持 Google、Bing、百度搜索切换。

## 功能

- 选择搜索引擎：Google / Bing / 百度
- 输入关键词后在新标签页打开搜索结果
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
