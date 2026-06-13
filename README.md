# Global GDP Explorer 🌍

一个可部署到 Vercel 的全栈 GDP 数据看板：

- 数据源：World Bank API
- 指标：`NY.GDP.MKTP.CD`，GDP current US$
- 前端：Next.js + Tailwind + Recharts
- API：Next.js Route Handlers
- 数据库：提供 PostgreSQL schema，可接 Vercel Postgres / Supabase / Neon

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

## 部署到 Vercel

### 方法 1：GitHub 导入

1. 新建 GitHub 仓库
2. 上传本项目所有文件
3. 打开 Vercel → Add New Project → Import Git Repository
4. Framework 选择 Next.js
5. 点击 Deploy

### 方法 2：Vercel CLI

```bash
npm i -g vercel
vercel login
vercel deploy
```

## API

- `GET /api/health`
- `GET /api/countries`
- `GET /api/gdp/latest?limit=50&year=latest`
- `GET /api/gdp/CHN`
- `GET /api/gdp/CHN/history?from=2005&to=2024`
- `POST /api/admin/sync-gdp`

## 数据库

执行：

```sql
\i database/schema.sql
```

或者把 `database/schema.sql` 内容粘贴到 Supabase / Neon / Vercel Postgres 的 SQL Editor 执行。

当前项目默认直接从 World Bank API 获取数据并缓存 24 小时，不强制依赖数据库，因此更容易免费部署。
