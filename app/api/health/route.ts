import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ ok: true, service: 'global-gdp-explorer', timestamp: new Date().toISOString() });
}
