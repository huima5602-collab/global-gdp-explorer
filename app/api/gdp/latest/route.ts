import { NextResponse } from 'next/server';
import { getLatestRanking } from '@/lib/worldbank';
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 250);
  const year = searchParams.get('year') ?? 'latest';
  const data = await getLatestRanking(limit, year);
  return NextResponse.json({ count: data.length, year, data });
}
