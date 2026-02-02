import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Fetch all invoices
export async function GET(request: NextRequest) {
  try {
    const invoices = await sql`
      SELECT 
        id,
        email,
        payment_method,
        payment_status,
        product,
        server_invite,
        amount,
        txid,
        created_at,
        updated_at
      FROM invoices
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST - Create new invoice
export async function POST(request: NextRequest) {
  try {
    const { id, email, paymentMethod, paymentStatus, product, serverInvite, amount } = await request.json();

    await sql`
      INSERT INTO invoices (id, email, payment_method, payment_status, product, server_invite, amount)
      VALUES (${id}, ${email}, ${paymentMethod}, ${paymentStatus}, ${product}, ${serverInvite}, ${amount})
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}

// PATCH - Update invoice status
export async function PATCH(request: NextRequest) {
  try {
    const { id, paymentStatus, txid } = await request.json();

    await sql`
      UPDATE invoices 
      SET payment_status = ${paymentStatus}, 
          txid = ${txid || null},
          updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
