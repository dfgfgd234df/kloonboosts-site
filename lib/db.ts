import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// Initialize database table
export async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      product TEXT NOT NULL,
      server_invite TEXT NOT NULL,
      amount TEXT NOT NULL,
      txid TEXT,
      ltc_address TEXT,
      ltc_amount DECIMAL,
      checkout_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}
