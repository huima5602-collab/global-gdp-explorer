import { NextResponse } from 'next/server';
import { getCountryProfile } from '@/lib/worldbank';

export async function GET(_: Request, { params }: { params: { iso3: string } }) {
  const data = await getCountryProfile(params.iso3);
  if (!data.latest && !data.meta) {
    return NextResponse.json({ error: 'Country not found', iso3: params.iso3.toUpperCase() }, { status: 404 });
  }
  return NextResponse.json(data);
}
