import { NextResponse } from 'next/server';
import { getCountryHistory } from '@/lib/worldbank';
export async function GET(req: Request, { params }: { params: { iso3: string } }) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get('from') ? Number(searchParams.get('from')) : undefined;
  const to = searchParams.get('to') ? Number(searchParams.get('to')) : undefined;
  const data = await getCountryHistory(params.iso3, from, to);
  return NextResponse.json({ iso3: params.iso3.toUpperCase(), count: data.length, data });
}
