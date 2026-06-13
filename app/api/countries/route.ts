import { NextResponse } from 'next/server';
import { fetchCountries } from '@/lib/worldbank';
export async function GET() {
  const countries = await fetchCountries();
  return NextResponse.json({ count: countries.length, data: countries });
}
