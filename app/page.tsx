'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Globe2, Search, Database, Server, TrendingUp, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import InteractiveGlobe from '@/components/InteractiveGlobe';
import { usdCompact } from '@/lib/format';

type Row = {
  rank: number;
  iso3: string;
  country: string;
  country_zh?: string;
  year: number;
  gdp_current_usd: number;
  gdp_trillion_usd: number;
  share_of_world_percent: number;
  latitude?: number | null;
  longitude?: number | null;
  flag_url?: string;
  population?: string;
};

type HistoryRow = { year: number; gdp_trillion_usd: number; country: string; country_zh?: string };

export default function Home() {
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('CHN');
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
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      r.country.toLowerCase().includes(q) ||
      r.iso3.toLowerCase().includes(q) ||
      (r.country_zh ?? '').includes(query.trim())
    );
  }, [rows, query]);

  const selectedRow = rows.find((r) => r.iso3 === selected);
  const total = rows.reduce((sum, r) => sum + r.gdp_current_usd, 0);
  const latestYear = rows[0]?.year ?? '-';

  return (
    <main className="mx-auto max-w-7xl px-5 py-8">
      <nav className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-sky-400/20 p-3"><Globe2 className="text-sky-300" /></div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">全球 GDP 数据地图</h1>
            <p className="text-sm text-slate-400">Global GDP Explorer · 面向中文用户的国家经济数据看板</p>
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

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <InteractiveGlobe points={rows.slice(0, 10)} />
        <div className="card">
          <h2 className="mb-1 text-xl font-bold">国家 GDP 趋势</h2>
          <p className="mb-5 text-sm text-slate-400">当前：{selectedRow?.country_zh ?? selected} / {selectedRow?.country ?? selected}。点击排行榜国家切换，点击详情进入国家页面。</p>
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
          {selectedRow && (
            <Link className="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-300" href={`/country/${selectedRow.iso3}`}>
              查看 {selectedRow.country_zh ?? selectedRow.country} 详情 <ExternalLink className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      <section className="mb-8">
        <div className="card">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">GDP 排行榜</h2>
              <p className="text-sm text-slate-400">国家名称分为中文与英文两栏，并支持中文、英文、ISO3 检索。</p>
            </div>
            <label className="relative block w-full sm:w-80">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input className="input w-full pl-10" placeholder="搜索 中国 / China / CHN..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400"><tr><th className="py-3">排名</th><th>中文名</th><th>英文名</th><th>ISO3</th><th>年份</th><th>GDP</th><th>人口</th><th>详情</th></tr></thead>
              <tbody>
                {loading && <tr><td className="py-6 text-slate-400" colSpan={8}>正在从 World Bank API 拉取数据...</td></tr>}
                {filtered.map((r) => (
                  <tr key={r.iso3} onClick={() => setSelected(r.iso3)} className="cursor-pointer border-t border-white/10 hover:bg-white/5">
                    <td className="py-3 font-semibold">#{r.rank}</td>
                    <td className="font-semibold text-white">{r.country_zh ?? r.country}</td>
                    <td>{r.country}</td>
                    <td><span className="rounded-lg bg-white/10 px-2 py-1">{r.iso3}</span></td>
                    <td>{r.year}</td>
                    <td>{usdCompact(r.gdp_current_usd)}</td>
                    <td>{r.population ?? '-'}</td>
                    <td><Link className="text-sky-300 hover:text-sky-200" href={`/country/${r.iso3}`} onClick={(e) => e.stopPropagation()}>查看</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-bold">升级说明</h2>
        <p className="mt-2 text-slate-300">当前版本面向中文用户：新增中文国家名、双语搜索、可旋转 3D 地球、Top10 国家定位点，以及国家详情页入口。</p>
      </section>
    </main>
  );
}
