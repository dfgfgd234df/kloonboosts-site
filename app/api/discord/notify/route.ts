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
        title: '🆕 New Invoice Created',
        color: 0x3b82f6, // Blue
        fields: [
          { name: '📧 Email', value: invoiceData.email, inline: true },
          { name: '💳 Payment Method', value: invoiceData.paymentMethod, inline: true },
          { name: '📦 Product', value: invoiceData.product, inline: true },
          { name: '💰 Amount', value: `$${invoiceData.amount}`, inline: true },
          { name: '📋 Invoice ID', value: invoiceData.id, inline: false },
          { name: '🎮 Server Invite', value: invoiceData.serverInvite || 'N/A', inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'KloonBoosts Payment System' }
      };
    } else if (type === 'paid') {
      embed = {
        title: '✅ Invoice Paid',
        color: 0x22c55e, // Green
        fields: [
          { name: '📧 Email', value: invoiceData.email, inline: true },
          { name: '💳 Payment Method', value: invoiceData.paymentMethod, inline: true },
          { name: '📦 Product', value: invoiceData.product, inline: true },
          { name: '💰 Amount', value: `$${invoiceData.amount}`, inline: true },
          { name: '📋 Invoice ID', value: invoiceData.id, inline: false },
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'KloonBoosts Payment System' }
      };
      
      if (invoiceData.txid) {
        embed.fields.push({
          name: '🔗 Transaction',
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
