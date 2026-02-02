import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

// GET - Fetch all invoices or a single invoice by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');

    if (invoiceId) {
      // Fetch single invoice
      const result = await sql`
        SELECT 
          id,
          email,
          payment_method,
          payment_status,
          product,
          server_invite,
          amount,
          txid,
          ltc_address,
          ltc_amount,
          checkout_url,
          created_at,
          updated_at
        FROM invoices
        WHERE id = ${invoiceId}
      `;

      if (result.length === 0) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
      }

      return NextResponse.json({ invoice: result[0] });
    }

    // Fetch all invoices
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
        ltc_address,
        ltc_amount,
        checkout_url,
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
    const { id, email, paymentMethod, paymentStatus, product, serverInvite, amount, ltcAddress, ltcAmount, checkoutUrl } = await request.json();

    await sql`
      INSERT INTO invoices (id, email, payment_method, payment_status, product, server_invite, amount, ltc_address, ltc_amount, checkout_url)
      VALUES (${id}, ${email}, ${paymentMethod}, ${paymentStatus}, ${product}, ${serverInvite}, ${amount}, ${ltcAddress || null}, ${ltcAmount || null}, ${checkoutUrl || null})
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
