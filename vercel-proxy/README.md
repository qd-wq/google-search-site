# Vercel Proxy (Recommended)

这个目录是给 Vercel 部署的后端代理，提供接口：

- `POST /api/compare`

前端 GitHub Pages 只需要调用这个接口，不暴露 API Key。

## 1) 创建 Vercel 项目

1. 打开 [https://vercel.com/new](https://vercel.com/new)
2. 选择导入这个仓库（或单独新建一个只放 `vercel-proxy` 的仓库）
3. Root Directory 选择 `vercel-proxy`

## 2) 配置环境变量（Vercel Project Settings -> Environment Variables）

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `ANTHROPIC_API_KEY`
- `ALLOWED_ORIGIN` = `https://qd-wq.github.io`
- `OPENAI_MODEL` = `gpt-4o-mini` (可选)
- `GEMINI_MODEL` = `gemini-2.0-flash` (可选)
- `CLAUDE_MODEL` = `claude-3-5-sonnet-latest` (可选)

## 3) 部署并获取接口地址

部署成功后会得到：

- `https://<your-project>.vercel.app/api/compare`

## 4) 前端接入

打开你的页面：

- [https://qd-wq.github.io/google-search-site/](https://qd-wq.github.io/google-search-site/)

在 `Proxy Endpoint` 输入上面的 Vercel 地址并保存。
