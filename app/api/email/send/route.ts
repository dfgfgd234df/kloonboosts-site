import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { type, email, invoiceData } = await request.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let subject, html;

    if (type === 'created') {
      subject = `Order Created - ${invoiceData.product}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { color: #6b7280; font-weight: 600; }
            .detail-value { color: #111827; font-weight: 500; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Order Created!</h1>
              <p>Thank you for your purchase</p>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Your order has been created successfully! Here are your order details:</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Order ID:</span>
                  <span class="detail-value">${invoiceData.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Product:</span>
                  <span class="detail-value">${invoiceData.product}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount:</span>
                  <span class="detail-value">${invoiceData.amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method:</span>
                  <span class="detail-value">${invoiceData.paymentMethod}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value" style="color: #eab308;">Pending Payment</span>
                </div>
              </div>

              ${invoiceData.paymentMethod === 'LTC' ? `
                <p style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                  <strong>⚡ Action Required:</strong> Please complete your Litecoin payment to process your order.
                </p>
              ` : ''}

              <p>You will receive another email once your payment is confirmed.</p>
            </div>
            <div class="footer">
              <p>Need help? Contact us at kloonboosts@gmail.com</p>
              <p>© ${new Date().getFullYear()} Kloonboosts. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'paid') {
      subject = `✅ Payment Confirmed - ${invoiceData.product}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
            .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { color: #6b7280; font-weight: 600; }
            .detail-value { color: #111827; font-weight: 500; }
            .success-badge { background: #d1fae5; color: #065f46; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: 600; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Payment Confirmed!</h1>
              <p>Your order is being processed</p>
            </div>
            <div class="content">
              <p>Great news!</p>
              <p>We've received your payment and your order is now being processed.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Order ID:</span>
                  <span class="detail-value">${invoiceData.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Product:</span>
                  <span class="detail-value">${invoiceData.product}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Paid:</span>
                  <span class="detail-value">${invoiceData.amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method:</span>
                  <span class="detail-value">${invoiceData.paymentMethod}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="success-badge">Confirmed</span>
                </div>
                ${invoiceData.serverInvite ? `
                <div class="detail-row">
                  <span class="detail-label">Server Invite:</span>
                  <span class="detail-value"><a href="${invoiceData.serverInvite}" style="color: #3b82f6;">${invoiceData.serverInvite}</a></span>
                </div>
                ` : ''}
                ${invoiceData.txid ? `
                <div class="detail-row">
                  <span class="detail-label">Transaction:</span>
                  <span class="detail-value"><a href="https://live.blockcypher.com/ltc/tx/${invoiceData.txid}" style="color: #3b82f6; font-size: 12px;">View on Blockchain</a></span>
                </div>
                ` : ''}
              </div>

              <p style="background: #d1fae5; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
                <strong>🎉 What's Next?</strong> Your Discord server boosts will be delivered shortly. Check your server to see the boost level increase!
              </p>

              <p>Thank you for choosing Kloonboosts!</p>
            </div>
            <div class="footer">
              <p>Need help? Contact us at kloonboosts@gmail.com</p>
              <p>© ${new Date().getFullYear()} Kloonboosts. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    await transporter.sendMail({
      from: `"Kloonboosts" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending failed:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
