import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { type, invoiceData } = await request.json();
    
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Discord webhook not configured' }, { status: 500 });
    }

    let embed;
    
    if (type === 'created') {
      embed = {
        title: 'Kloonboosts Payment System',
        description: '**Order Created**',
        color: 0x3b82f6, // Blue
        fields: [
          { name: 'Order ID', value: invoiceData.id, inline: false },
          { name: 'Customer Email', value: invoiceData.email, inline: false },
          { name: 'Product', value: invoiceData.product, inline: false },
          { name: 'Server Invite Link', value: invoiceData.serverInvite || 'N/A', inline: false },
          { name: 'Payment Method', value: invoiceData.paymentMethod, inline: false },
          { name: 'Total', value: `USD ${invoiceData.amount}`, inline: false },
        ],
        timestamp: new Date().toISOString(),
      };
    } else if (type === 'paid') {
      embed = {
        title: 'Kloonboosts Payment System',
        description: '**Order Completed**',
        color: 0x22c55e, // Green
        fields: [
          { name: 'Product', value: invoiceData.product, inline: false },
          { name: 'Permanent Server Invite Link', value: invoiceData.serverInvite || 'N/A', inline: false },
          { name: 'Value', value: `$${invoiceData.amount}`, inline: true },
          { name: 'Gateway', value: invoiceData.paymentMethod, inline: true },
          { name: 'Order ID', value: invoiceData.id, inline: false },
          { name: 'Customer Email', value: invoiceData.email, inline: false },
        ],
        timestamp: new Date().toISOString(),
      };
      
      if (invoiceData.txid) {
        embed.fields.push({
          name: 'Transaction',
          value: `[View on BlockCypher](https://live.blockcypher.com/ltc/tx/${invoiceData.txid})`,
          inline: false
        });
      }
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] })
    });

    if (!response.ok) {
      throw new Error('Failed to send Discord notification');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Discord notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
