'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Building2, Flag, Landmark, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { usdCompact } from '@/lib/format';

type City = { nameZh: string; nameEn: string; image: string; description: string };
type Attraction = { nameZh: string; nameEn: string; image: string; description: string };
type Profile = {
  iso3: string;
  latest: { country: string; country_zh?: string; year: number; gdp_current_usd: number; gdp_trillion_usd: number } | null;
  history: { year: number; gdp_trillion_usd: number }[];
  meta: {
    nameZh: string; nameEn: string; capitalZh: string; capitalEn: string; population: string; flagUrl: string; summary: string;
    cities: City[]; attractions: Attraction[];
  } | null;
};

export default function CountryPage({ params }: { params: { iso3: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/country/${params.iso3}`)
      .then((r) => r.json())
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [params.iso3]);

  if (loading) return <main className="mx-auto max-w-6xl px-5 py-10 text-slate-300">正在加载国家经济信息...</main>;
  if (!profile || (!profile.latest && !profile.meta)) return <main className="mx-auto max-w-6xl px-5 py-10">未找到该国家信息。</main>;

  const meta = profile.meta;
  const latest = profile.latest;
  const titleZh = meta?.nameZh ?? latest?.country_zh ?? profile.iso3;
  const titleEn = meta?.nameEn ?? latest?.country ?? profile.iso3;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sky-300 hover:text-sky-200"><ArrowLeft className="h-4 w-4" /> 返回全球排行榜</Link>

      <section className="card mb-8 overflow-hidden">
        <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-center">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.35em] text-sky-300">Country Profile · {profile.iso3}</p>
            <h1 className="text-4xl font-black">{titleZh} <span className="text-slate-400">/ {titleEn}</span></h1>
            <p className="mt-4 max-w-3xl text-slate-300">{meta?.summary ?? '该国家已接入 World Bank GDP 数据，更多中文资料可继续补充。'}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 p-4"><Landmark className="mb-2 text-amber-300" /><p className="text-sm text-slate-400">首都</p><b>{meta ? `${meta.capitalZh} / ${meta.capitalEn}` : '-'}</b></div>
              <div className="rounded-2xl bg-white/5 p-4"><Users className="mb-2 text-emerald-300" /><p className="text-sm text-slate-400">人口</p><b>{meta?.population ?? '-'}</b></div>
              <div className="rounded-2xl bg-white/5 p-4"><Building2 className="mb-2 text-purple-300" /><p className="text-sm text-slate-400">最新 GDP</p><b>{latest ? usdCompact(latest.gdp_current_usd) : '-'}</b></div>
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-center">
            {meta?.flagUrl ? <img className="mx-auto mb-4 h-36 rounded-xl object-cover shadow-2xl" src={meta.flagUrl} alt={`${titleZh} flag`} /> : <Flag className="mx-auto h-24 w-24 text-slate-500" />}
            <p className="text-sm text-slate-400">国旗 / National Flag</p>
          </div>
        </div>
      </section>

      <section className="card mb-8">
        <h2 className="mb-4 text-2xl font-bold">GDP 历史趋势</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profile.history}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => `$${v}T`} />
              <Tooltip formatter={(v) => [`$${v}T`, 'GDP']} />
              <Line type="monotone" dataKey="gdp_trillion_usd" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">主要城市</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {(meta?.cities ?? []).map((city) => (
            <article key={city.nameEn} className="card overflow-hidden p-0">
              <img className="h-44 w-full object-cover" src={city.image} alt={city.nameZh} />
              <div className="p-5"><h3 className="text-xl font-bold">{city.nameZh}</h3><p className="text-sm text-slate-400">{city.nameEn}</p><p className="mt-2 text-slate-300">{city.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">著名旅游景点</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {(meta?.attractions ?? []).map((a) => (
            <article key={a.nameEn} className="card overflow-hidden p-0">
              <img className="h-56 w-full object-cover" src={a.image} alt={a.nameZh} />
              <div className="p-5"><h3 className="text-xl font-bold">{a.nameZh}</h3><p className="text-sm text-slate-400">{a.nameEn}</p><p className="mt-2 text-slate-300">{a.description}</p></div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
