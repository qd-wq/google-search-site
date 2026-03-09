# AI Compare Site (ChatGPT / Gemini / Claude)

一个基于 `GitHub Pages + 后端代理` 的对比问答网站。

用户输入一个问题后，由代理并发请求 ChatGPT、Gemini、Claude，前端按三列展示结果。

## 目录结构

- `index.html`：GitHub Pages 前端页面
- `vercel-proxy/`：Vercel 代理服务（推荐）
- `proxy-worker/`：Cloudflare Worker 代理服务（可选）

## 使用流程

1. 先部署 `vercel-proxy`（见 `vercel-proxy/README.md`）
2. 拿到 Vercel 地址后，接口是：
   - `https://<your-project>.vercel.app/api/compare`
3. 打开你的 GitHub Pages 页面，把这个地址填入 `Proxy Endpoint`
4. 输入问题并点击“开始提问”

## 前端发布

```bash
git add .
git commit -m "feat: use backend proxy for ai compare"
git push
```

发布后页面地址仍是：

`https://qd-wq.github.io/google-search-site/`
