import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// Initialize database table
export async function initDatabase() {
  // Create table if it doesn't exist
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

  // Add new columns if they don't exist (for existing tables)
  try {
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS ltc_address TEXT`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS ltc_amount DECIMAL`;
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS checkout_url TEXT`;
  } catch (error) {
    // Columns might already exist, ignore error
    console.log('Migration note:', error);
  }
}
