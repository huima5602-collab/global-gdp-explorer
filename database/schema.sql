-- Global GDP Explorer database schema
-- Compatible with Vercel Postgres, Supabase, Neon and standard PostgreSQL.

CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  iso2 VARCHAR(2),
  iso3 VARCHAR(3) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT,
  income_level TEXT,
  capital_city TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gdp_records (
  id SERIAL PRIMARY KEY,
  country_iso3 VARCHAR(3) NOT NULL REFERENCES countries(iso3) ON DELETE CASCADE,
  year INT NOT NULL,
  gdp_current_usd NUMERIC(20, 2),
  source TEXT DEFAULT 'World Bank WDI',
  indicator_code TEXT DEFAULT 'NY.GDP.MKTP.CD',
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country_iso3, year)
);

CREATE INDEX IF NOT EXISTS idx_gdp_records_year ON gdp_records(year DESC);
CREATE INDEX IF NOT EXISTS idx_gdp_records_country_year ON gdp_records(country_iso3, year DESC);
