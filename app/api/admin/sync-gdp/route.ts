import { NextResponse } from 'next/server';
import { fetchCountries, fetchGdpRecords } from '@/lib/worldbank';

export async function POST(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (process.env.ADMIN_TOKEN && token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized. Send Authorization: Bearer <ADMIN_TOKEN>.' }, { status: 401 });
  }

  const countries = await fetchCountries();
  const records = await fetchGdpRecords();

  return NextResponse.json({
    ok: true,
    message: 'World Bank data fetched. To persist, run database/schema.sql on Vercel Postgres/Supabase/Neon and extend this route with INSERT/UPSERT logic.',
    countries_count: countries.length,
    gdp_records_count: records.length,
    sample_country: countries[0] ?? null,
    sample_gdp_record: records[0] ?? null
  });
}
