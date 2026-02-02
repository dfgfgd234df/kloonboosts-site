import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    
    // Verify webhook signature (important for security)
    const signature = req.headers.get("x-whop-signature");
    
    // TODO: Verify signature with your Whop webhook secret
    // const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
    
    console.log("Webhook received:", payload.type);

    // Handle different webhook events
    switch (payload.type) {
      case "payment.succeeded":
        // Invoice is automatically created by Whop
        console.log("Payment succeeded:", payload.data);
        
        // Extract custom metadata
        const { serverInvite, productTitle } = payload.data.metadata || {};
        const customerEmail = payload.data.email;
        
        // Add your custom logic here:
        // - Send confirmation email
        // - Deliver the boosts to the Discord server
        // - Save to database
        // - Send webhook to Discord bot
        
        console.log(`Delivering ${productTitle} to ${serverInvite} for ${customerEmail}`);
        
        break;
      
      case "payment.failed":
        console.log("Payment failed:", payload.data);
        // Handle failed payment
        break;
      
      case "payment.refunded":
        console.log("Payment refunded:", payload.data);
        // Handle refund
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
