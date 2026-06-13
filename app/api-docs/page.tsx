const routes = [
  ['GET', '/api/health', '服务健康检查'],
  ['GET', '/api/countries', '返回国家列表与区域、收入水平等元数据'],
  ['GET', '/api/gdp/latest?limit=50&year=latest', '返回最新 GDP 排行榜'],
  ['GET', '/api/gdp/CHN', '返回中国最新 GDP 数据'],
  ['GET', '/api/gdp/USA/history?from=2005&to=2024', '返回美国 GDP 历史趋势'],
  ['POST', '/api/admin/sync-gdp', '触发 World Bank GDP 同步，建议用 ADMIN_TOKEN 保护']
];

export default function ApiDocs() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <a className="text-sky-300" href="/">← 返回首页</a>
      <h1 className="mt-6 text-4xl font-bold">API 文档</h1>
      <p className="mt-3 text-slate-300">数据源：World Bank API。GDP 指标：NY.GDP.MKTP.CD，也就是 GDP current US$。</p>
      <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10 text-slate-300"><tr><th className="p-4">方法</th><th>路由</th><th>说明</th></tr></thead>
          <tbody>
            {routes.map(([m, r, d]) => (
              <tr className="border-t border-white/10" key={r}>
                <td className="p-4 font-bold text-sky-300">{m}</td>
                <td><code>{r}</code></td>
                <td className="text-slate-300">{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre className="mt-8 overflow-auto rounded-3xl border border-white/10 bg-slate-950 p-5 text-sm text-slate-300">{`curl https://your-domain.vercel.app/api/gdp/latest?limit=10
curl https://your-domain.vercel.app/api/gdp/CHN/history?from=2005`}</pre>
    </main>
  );
}
