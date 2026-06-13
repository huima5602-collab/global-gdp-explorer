export type Country = {
  id: string;
  iso2Code: string;
  name: string;
  region: { id: string; value: string };
  adminregion?: { id: string; value: string };
  incomeLevel: { id: string; value: string };
  capitalCity?: string;
  longitude?: string;
  latitude?: string;
};

export type GdpRecord = {
  countryiso3code: string;
  date: string;
  value: number | null;
  country: { id: string; value: string };
  indicator: { id: string; value: string };
};

export type LatestGdp = {
  rank: number;
  iso3: string;
  country: string;
  year: number;
  gdp_current_usd: number;
  gdp_trillion_usd: number;
  share_of_world_percent: number;
};

const GDP_INDICATOR = 'NY.GDP.MKTP.CD';
const WB_BASE = 'https://api.worldbank.org/v2';

async function wbFetch<T>(url: string): Promise<T[]> {
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);
  const json = await res.json();
  if (!Array.isArray(json) || !Array.isArray(json[1])) return [];
  return json[1] as T[];
}

export async function fetchCountries(): Promise<Country[]> {
  const url = `${WB_BASE}/country?format=json&per_page=400`;
  const rows = await wbFetch<Country>(url);
  return rows
    .filter((c) => c.region?.id && c.region.id !== 'NA')
    .filter((c) => c.incomeLevel?.id && c.incomeLevel.id !== 'NA')
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchGdpRecords(from?: number, to?: number): Promise<GdpRecord[]> {
  const end = to ?? new Date().getFullYear();
  const start = from ?? end - 20;
  const url = `${WB_BASE}/country/all/indicator/${GDP_INDICATOR}?format=json&per_page=20000&date=${start}:${end}`;
  const rows = await wbFetch<GdpRecord>(url);
  return rows.filter((r) => r.value !== null && r.countryiso3code && r.countryiso3code.length === 3);
}

export async function getLatestRanking(limit = 50, yearParam = 'latest'): Promise<LatestGdp[]> {
  const countries = await fetchCountries();
  const countrySet = new Set(countries.map((c) => c.id));
  const records = await fetchGdpRecords();
  const byCountry = new Map<string, GdpRecord>();

  for (const r of records) {
    if (!countrySet.has(r.countryiso3code) || r.value === null) continue;
    const y = Number(r.date);
    if (yearParam !== 'latest' && y !== Number(yearParam)) continue;
    const old = byCountry.get(r.countryiso3code);
    if (!old || Number(old.date) < y) byCountry.set(r.countryiso3code, r);
  }

  const rows = Array.from(byCountry.values())
    .filter((r) => typeof r.value === 'number')
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
  const worldTotal = rows.reduce((sum, r) => sum + (r.value ?? 0), 0);

  return rows.slice(0, limit).map((r, i) => ({
    rank: i + 1,
    iso3: r.countryiso3code,
    country: r.country.value,
    year: Number(r.date),
    gdp_current_usd: r.value ?? 0,
    gdp_trillion_usd: Number(((r.value ?? 0) / 1e12).toFixed(3)),
    share_of_world_percent: Number((((r.value ?? 0) / worldTotal) * 100).toFixed(2))
  }));
}

export async function getCountryHistory(iso3: string, from?: number, to?: number) {
  const records = await fetchGdpRecords(from, to);
  return records
    .filter((r) => r.countryiso3code.toUpperCase() === iso3.toUpperCase())
    .map((r) => ({
      iso3: r.countryiso3code,
      country: r.country.value,
      year: Number(r.date),
      gdp_current_usd: r.value ?? 0,
      gdp_trillion_usd: Number(((r.value ?? 0) / 1e12).toFixed(3)),
      indicator_code: r.indicator.id,
      indicator_name: r.indicator.value,
      source: 'World Bank WDI'
    }))
    .sort((a, b) => a.year - b.year);
}
