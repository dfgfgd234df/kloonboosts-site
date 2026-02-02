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
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              line-height: 1.6; 
              color: #e4e4e7;
              background-color: #09090b;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background-color: #18181b;
              border: 1px solid #27272a;
              border-radius: 12px;
              overflow: hidden;
            }
            .header { 
              background-color: #09090b;
              border-bottom: 1px solid #27272a;
              padding: 32px;
              text-align: center;
            }
            .logo { 
              color: #ffffff;
              font-size: 24px;
              font-weight: 700;
              margin: 0;
            }
            .logo-accent { color: #3b82f6; }
            .content { 
              padding: 32px;
            }
            .title {
              font-size: 20px;
              font-weight: 600;
              color: #ffffff;
              margin: 0 0 24px 0;
            }
            .text {
              color: #a1a1aa;
              margin: 0 0 24px 0;
            }
            .details { 
              background-color: #09090b;
              border: 1px solid #27272a;
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
            }
            .detail-row { 
              display: flex; 
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #27272a;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label { 
              color: #71717a;
              font-size: 14px;
            }
            .detail-value { 
              color: #e4e4e7;
              font-weight: 500;
              font-size: 14px;
            }
            .alert {
              background-color: #422006;
              border: 1px solid #713f12;
              border-left: 4px solid #f59e0b;
              padding: 16px;
              border-radius: 6px;
              margin: 24px 0;
            }
            .alert-text {
              color: #fbbf24;
              margin: 0;
              font-size: 14px;
            }
            .status-pending {
              color: #eab308;
            }
            .footer { 
              background-color: #09090b;
              border-top: 1px solid #27272a;
              text-align: center;
              padding: 24px;
              color: #71717a;
              font-size: 13px;
            }
            .footer-links {
              margin: 16px 0;
            }
            .footer-link {
              color: #3b82f6;
              text-decoration: none;
              margin: 0 12px;
            }
            .footer-link:hover {
              text-decoration: underline;
            }
            .button {
              display: inline-block;
              padding: 14px 28px;
              background-color: #3b82f6;
              color: #ffffff;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 15px;
              margin: 24px 0;
            }
            .button:hover {
              background-color: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">Kloon<span class="logo-accent">boosts</span></h1>
            </div>
            <div class="content">
              <h2 class="title">Order Created</h2>
              <p class="text">Your order has been created successfully. Please review the details below:</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Order ID</span>
                  <span class="detail-value">${invoiceData.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Product</span>
                  <span class="detail-value">${invoiceData.product}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount</span>
                  <span class="detail-value">${invoiceData.amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method</span>
                  <span class="detail-value">${invoiceData.paymentMethod}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="detail-value status-pending">Pending Payment</span>
                </div>
              </div>

              ${invoiceData.paymentMethod === 'LTC' ? `
                <div class="alert">
                  <p class="alert-text"><strong>Action Required:</strong> Please complete your Litecoin payment to process your order.</p>
                </div>
              ` : ''}

              <div style="text-align: center;">
                <a href="${invoiceData.paymentMethod === 'LTC' 
                  ? `https://kloonboosts.com/?invoice=${invoiceData.id}` 
                  : invoiceData.checkoutUrl || 'https://kloonboosts.com'}" 
                  class="button">
                  ${invoiceData.paymentMethod === 'LTC' ? 'View Invoice & Pay' : 'Complete Payment'}
                </a>
              </div>

              <p class="text">You will receive a confirmation email once your payment has been processed.</p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 8px 0;">Need assistance? Contact us at <a href="mailto:kloonboosts@gmail.com" style="color: #3b82f6; text-decoration: none;">kloonboosts@gmail.com</a></p>
              <div class="footer-links">
                <a href="https://kloonboosts.com" class="footer-link">Visit Website</a>
                <a href="https://discord.gg/kloonboosts" class="footer-link">Join Discord</a>
              </div>
              <p style="margin: 16px 0 0 0;">© ${new Date().getFullYear()} Kloonboosts. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else if (type === 'paid') {
      subject = `Payment Confirmed - ${invoiceData.product}`;
      html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              line-height: 1.6; 
              color: #e4e4e7;
              background-color: #09090b;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background-color: #18181b;
              border: 1px solid #27272a;
              border-radius: 12px;
              overflow: hidden;
            }
            .header { 
              background-color: #09090b;
              border-bottom: 1px solid #27272a;
              padding: 32px;
              text-align: center;
            }
            .logo { 
              color: #ffffff;
              font-size: 24px;
              font-weight: 700;
              margin: 0;
            }
            .logo-accent { color: #3b82f6; }
            .content { 
              padding: 32px;
            }
            .title {
              font-size: 20px;
              font-weight: 600;
              color: #ffffff;
              margin: 0 0 24px 0;
            }
            .text {
              color: #a1a1aa;
              margin: 0 0 24px 0;
            }
            .details { 
              background-color: #09090b;
              border: 1px solid #27272a;
              border-radius: 8px;
              padding: 20px;
              margin: 24px 0;
            }
            .detail-row { 
              display: flex; 
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #27272a;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label { 
              color: #71717a;
              font-size: 14px;
            }
            .detail-value { 
              color: #e4e4e7;
              font-weight: 500;
              font-size: 14px;
            }
            .detail-link {
              color: #3b82f6;
              text-decoration: none;
              word-break: break-all;
            }
            .detail-link:hover {
              text-decoration: underline;
            }
            .success-badge {
              background-color: #052e16;
              color: #22c55e;
              border: 1px solid #166534;
              padding: 6px 14px;
              border-radius: 6px;
              display: inline-block;
              font-weight: 600;
              font-size: 13px;
            }
            .info-box {
              background-color: #172554;
              border: 1px solid #1e40af;
              border-left: 4px solid #3b82f6;
              padding: 16px;
              border-radius: 6px;
              margin: 24px 0;
            }
            .info-text {
              color: #93c5fd;
              margin: 0;
              font-size: 14px;
            }
            .footer { 
              background-color: #09090b;
              border-top: 1px solid #27272a;
              text-align: center;
              padding: 24px;
              color: #71717a;
              font-size: 13px;
            }
            .footer-links {
              margin: 16px 0;
            }
            .footer-link {
              color: #3b82f6;
              text-decoration: none;
              margin: 0 12px;
            }
            .footer-link:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="logo">Kloon<span class="logo-accent">boosts</span></h1>
            </div>
            <div class="content">
              <h2 class="title">Payment Confirmed</h2>
              <p class="text">Your payment has been successfully processed and your order is now complete.</p>
              
              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Order ID</span>
                  <span class="detail-value">${invoiceData.id}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Product</span>
                  <span class="detail-value">${invoiceData.product}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Amount Paid</span>
                  <span class="detail-value">${invoiceData.amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method</span>
                  <span class="detail-value">${invoiceData.paymentMethod}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status</span>
                  <span class="success-badge">Confirmed</span>
                </div>
                ${invoiceData.serverInvite ? `
                <div class="detail-row">
                  <span class="detail-label">Server Invite</span>
                  <span class="detail-value"><a href="${invoiceData.serverInvite}" class="detail-link">${invoiceData.serverInvite}</a></span>
                </div>
                ` : ''}
                ${invoiceData.txid ? `
                <div class="detail-row">
                  <span class="detail-label">Transaction</span>
                  <span class="detail-value"><a href="https://live.blockcypher.com/ltc/tx/${invoiceData.txid}" class="detail-link">View on Blockchain</a></span>
                </div>
                ` : ''}
              </div>

              <div class="info-box">
                <p class="info-text"><strong>Next Steps:</strong> Your Discord server boosts will be delivered shortly. Check your server to see the boost level increase.</p>
              </div>

              <p class="text">Thank you for choosing Kloonboosts.</p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 8px 0;">Need assistance? Contact us at <a href="mailto:kloonboosts@gmail.com" style="color: #3b82f6; text-decoration: none;">kloonboosts@gmail.com</a></p>
              <div class="footer-links">
                <a href="https://kloonboosts.com" class="footer-link">Visit Website</a>
                <a href="https://discord.gg/kloonboosts" class="footer-link">Join Discord</a>
              </div>
              <p style="margin: 16px 0 0 0;">© ${new Date().getFullYear()} Kloonboosts. All rights reserved.</p>
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
