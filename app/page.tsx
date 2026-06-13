'use client';

import { useEffect, useMemo, useState } from 'react';
import { Globe2, Search, Database, Server, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { usdCompact } from '@/lib/format';

type Row = {
  rank: number;
  iso3: string;
  country: string;
  year: number;
  gdp_current_usd: number;
  gdp_trillion_usd: number;
  share_of_world_percent: number;
};

type HistoryRow = { year: number; gdp_trillion_usd: number; country: string };

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('USA');
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gdp/latest?limit=100')
      .then((r) => r.json())
      .then((d) => setRows(d.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch(`/api/gdp/${selected}/history?from=2005`)
      .then((r) => r.json())
      .then((d) => setHistory(d.data ?? []));
  }, [selected]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return rows.filter((r) => r.country.toLowerCase().includes(q) || r.iso3.toLowerCase().includes(q));
  }, [rows, query]);

  const total = rows.reduce((sum, r) => sum + r.gdp_current_usd, 0);
  const latestYear = rows[0]?.year ?? '-';

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <nav className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-400/20 p-3"><Globe2 className="text-sky-300" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Global GDP Explorer</h1>
            <p className="text-sm text-slate-400">World Bank WDI · GDP current US$ · API + 数据库方案</p>
          </div>
        </div>
        <div className="flex gap-3 text-sm">
          <a className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/10" href="/api-docs">API 文档</a>
          <a className="rounded-xl border border-white/10 px-4 py-2 hover:bg-white/10" href="/api/health">Health</a>
        </div>
      </nav>

      <section className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="card"><Globe2 className="mb-3 text-sky-300" /><p className="text-sm text-slate-400">最近年份</p><p className="text-3xl font-bold">{latestYear}</p></div>
        <div className="card"><Database className="mb-3 text-emerald-300" /><p className="text-sm text-slate-400">国家/经济体</p><p className="text-3xl font-bold">{rows.length}</p></div>
        <div className="card"><TrendingUp className="mb-3 text-purple-300" /><p className="text-sm text-slate-400">Top100 GDP 合计</p><p className="text-3xl font-bold">{usdCompact(total)}</p></div>
        <div className="card"><Server className="mb-3 text-amber-300" /><p className="text-sm text-slate-400">API 状态</p><p className="text-3xl font-bold">Ready</p></div>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
        <div className="card">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">GDP 排行榜</h2>
              <p className="text-sm text-slate-400">支持国家名与 ISO3 搜索，默认展示最新可用年份。</p>
            </div>
            <label className="relative block">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input className="input pl-10" placeholder="搜索 China / CHN..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-3">排名</th><th>国家</th><th>ISO3</th><th>年份</th><th>GDP</th><th>占比</th></tr></thead>
              <tbody>
                {loading && <tr><td className="py-6 text-slate-400" colSpan={6}>正在从 World Bank API 拉取数据...</td></tr>}
                {filtered.map((r) => (
                  <tr key={r.iso3} onClick={() => setSelected(r.iso3)} className="cursor-pointer border-t border-white/10 hover:bg-white/5">
                    <td className="py-3 font-semibold">#{r.rank}</td>
                    <td>{r.country}</td>
                    <td><span className="rounded-lg bg-white/10 px-2 py-1">{r.iso3}</span></td>
                    <td>{r.year}</td>
                    <td>{usdCompact(r.gdp_current_usd)}</td>
                    <td>{r.share_of_world_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-1 text-xl font-bold">国家 GDP 趋势</h2>
          <p className="mb-5 text-sm text-slate-400">当前：{selected}，点击左侧国家切换。</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(v) => `$${v}T`} />
                <Tooltip formatter={(v) => [`$${v}T`, 'GDP']} />
                <Line type="monotone" dataKey="gdp_trillion_usd" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold">部署说明</h2>
        <p className="mt-2 text-slate-300">这个项目可直接部署到 Vercel。默认使用 World Bank API 实时读取并缓存 24 小时；如需真实入库，可执行 database/schema.sql 并配置 Vercel Postgres、Supabase 或 Neon。</p>
      </section>
    </main>
  );
}
