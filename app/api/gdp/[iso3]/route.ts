import { NextResponse } from 'next/server';
import { getCountryHistory } from '@/lib/worldbank';
export async function GET(_: Request, { params }: { params: { iso3: string } }) {
  const history = await getCountryHistory(params.iso3);
  const latest = history.at(-1) ?? null;
  return NextResponse.json({ iso3: params.iso3.toUpperCase(), data: latest, history_count: history.length });
}
