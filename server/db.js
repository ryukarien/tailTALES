import pg from 'pg'

// DATABASE_URL comes from whichever host you pick (Neon, Railway, Supabase all
// give you one of these). Neon/most hosted Postgres need SSL.
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
})