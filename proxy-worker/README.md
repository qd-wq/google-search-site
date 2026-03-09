# Cloudflare Worker Proxy

这个 Worker 用于代理 ChatGPT / Gemini / Claude 请求，避免把 API Key 暴露在前端。

## 1) 安装与登录

```bash
npm install -g wrangler
wrangler login
```

## 2) 配置并写入密钥

在 `wrangler.toml` 中确认 `ALLOWED_ORIGIN`（你的 GitHub Pages 域名）。

```bash
cd proxy-worker
wrangler secret put OPENAI_API_KEY
wrangler secret put GEMINI_API_KEY
wrangler secret put ANTHROPIC_API_KEY
```

## 3) 部署

```bash
wrangler deploy
```

部署后会得到类似：

`https://ai-compare-proxy.<your-subdomain>.workers.dev`

前端页面里填：

`https://ai-compare-proxy.<your-subdomain>.workers.dev/api/compare`

## 4) 前端发布

```bash
cd ..
git add .
git commit -m "feat: use backend proxy for ai compare"
git push
```
