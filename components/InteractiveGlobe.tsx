'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import { usdCompact } from '@/lib/format';

type GlobePoint = {
  rank: number;
  iso3: string;
  country: string;
  country_zh?: string;
  latitude?: number | null;
  longitude?: number | null;
  gdp_current_usd: number;
  year: number;
  share_of_world_percent: number;
  population?: string;
};

const EARTH_TEXTURE = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Earthmap1000x500compac.jpg/1000px-Earthmap1000x500compac.jpg';

function project(lat: number, lon: number, rotation: number) {
  const r = Math.PI / 180;
  const rotatedLon = (lon + rotation) * r;
  const latRad = lat * r;
  const x = 50 + 42 * Math.cos(latRad) * Math.sin(rotatedLon);
  const y = 50 - 42 * Math.sin(latRad);
  const z = Math.cos(latRad) * Math.cos(rotatedLon);
  return { x, y, visible: z > -0.2, scale: Math.max(0.72, z + 0.62), z };
}

export default function InteractiveGlobe({ points }: { points: GlobePoint[] }) {
  const [rotation, setRotation] = useState(-110);
  const [dragging, setDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const topPoints = useMemo(() => points.filter((p) => typeof p.latitude === 'number' && typeof p.longitude === 'number').slice(0, 10), [points]);
  const textureX = 50 - ((rotation % 360) / 360) * 100;

  function startDrag(clientX: number) {
    setDragging(true);
    setLastX(clientX);
  }

  function moveDrag(clientX: number) {
    if (!dragging) return;
    setRotation((r) => r + (clientX - lastX) * 0.65);
    setLastX(clientX);
  }

  return (
    <div className="card overflow-hidden">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">全球 GDP Top10 真实地球</h2>
          <p className="text-sm text-slate-400">真实地球贴图包含大陆、海洋与板块轮廓；拖动可旋转，悬停定位点查看信息。</p>
        </div>
        <span className="rounded-full border border-sky-300/30 px-3 py-1 text-xs text-sky-200">Real Earth</span>
      </div>
      <div
        className="relative mx-auto aspect-square max-w-[580px] cursor-grab select-none overflow-hidden rounded-full border border-sky-300/30 shadow-[0_0_80px_rgba(56,189,248,.40)] active:cursor-grabbing"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 22%, rgba(255,255,255,.42), rgba(255,255,255,.04) 24%, transparent 48%), url(${EARTH_TEXTURE})`,
          backgroundSize: '100% 100%, 225% 100%',
          backgroundPosition: `center, ${textureX}% center`,
          backgroundRepeat: 'no-repeat, repeat-x'
        }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={() => setDragging(false)}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_28%_20%,rgba(255,255,255,.12),transparent_23%),radial-gradient(circle_at_72%_80%,rgba(2,6,23,.55),transparent_48%)]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_-55px_-30px_80px_rgba(2,6,23,.72),inset_22px_14px_35px_rgba(255,255,255,.12)]" />
        <div className="absolute inset-0 rounded-full opacity-20 [background-image:linear-gradient(90deg,transparent_49%,rgba(255,255,255,.18)_50%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,.12)_50%,transparent_51%)] [background-size:54px_54px]" />
        <div className="absolute inset-[-3%] rounded-full border border-white/20" />
        {topPoints.map((p) => {
          const pos = project(p.latitude as number, p.longitude as number, rotation);
          if (!pos.visible) return null;
          return (
            <Link
              key={p.iso3}
              href={`/country/${p.iso3}`}
              className="group absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -100%) scale(${pos.scale})` }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500 text-white shadow-[0_0_22px_rgba(244,63,94,.8)] ring-4 ring-rose-400/25 transition group-hover:scale-125">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="pointer-events-none absolute left-1/2 top-[-118px] hidden w-64 -translate-x-1/2 rounded-2xl border border-white/15 bg-slate-950/95 p-3 text-xs shadow-2xl backdrop-blur group-hover:block">
                <b className="text-base text-white">#{p.rank} {p.country_zh ?? p.country}</b>
                <span className="mt-1 block text-slate-300">{p.country} · {p.iso3}</span>
                <span className="mt-2 block text-sky-200">GDP：{usdCompact(p.gdp_current_usd)}</span>
                <span className="block text-slate-300">年份：{p.year} · 全球占比：{p.share_of_world_percent}%</span>
                {p.population && <span className="block text-slate-300">人口：{p.population}</span>}
                <span className="mt-2 block text-amber-200">点击查看经济、城市与旅游信息 →</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
