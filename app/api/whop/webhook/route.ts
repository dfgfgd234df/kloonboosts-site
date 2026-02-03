import { NextRequest, NextResponse } from "next/server";
import crypto from 'crypto';
import { sql } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-whop-signature");
    
    // Verify webhook signature
    if (signature) {
      const webhookSecret = process.env.WHOP_WEBHOOK_SECRET!;
      const computedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');
      
      if (signature !== computedSignature) {
        console.error('Invalid webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }
    
    const payload = JSON.parse(body);
    console.log("Webhook received:", payload.type);

    // Handle different webhook events
    switch (payload.type) {
      case "payment.succeeded":
        console.log("Payment succeeded:", payload.data);
        
        const customerEmail = payload.data.email || payload.data.user?.email;
        
        // Find the most recent pending Whop invoice for this email
        const invoices = await sql`
          SELECT * FROM invoices 
          WHERE email = ${customerEmail}
          AND payment_method = 'Whop' 
          AND payment_status = 'pending'
          ORDER BY created_at DESC 
          LIMIT 1
        `;

        if (invoices.length > 0) {
          const invoice = invoices[0];
          
          // Update invoice status
          await sql`
            UPDATE invoices 
            SET payment_status = 'confirmed',
                txid = ${payload.data.id || payload.data.payment_id || ''},
                updated_at = NOW()
            WHERE id = ${invoice.id}
          `;

          // Send Discord notification
          try {
            await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/discord/notify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                type: 'paid', 
                invoiceData: {
                  id: invoice.id,
                  email: invoice.email,
                  product: invoice.product,
                  amount: invoice.amount,
                  paymentMethod: 'Whop',
                  serverInvite: invoice.server_invite,
                }
              }),
            });
          } catch (error) {
            console.error('Failed to send Discord notification:', error);
          }

          // Send email notification
          try {
            await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/email/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                type: 'paid', 
                email: invoice.email,
                invoiceData: {
                  id: invoice.id,
                  email: invoice.email,
                  product: invoice.product,
                  amount: invoice.amount,
                  paymentMethod: 'Whop',
                  serverInvite: invoice.server_invite,
                }
              }),
            });
          } catch (error) {
            console.error('Failed to send email notification:', error);
          }

          console.log('Whop payment processed successfully:', invoice.id);
        } else {
          console.warn('No matching invoice found for payment:', customerEmail);
        }
        
        break;
      
      case "payment.failed":
        console.log("Payment failed:", payload.data);
        break;
      
      case "payment.refunded":
        console.log("Payment refunded:", payload.data);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
