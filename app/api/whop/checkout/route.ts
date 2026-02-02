import { NextRequest, NextResponse } from "next/server";
import Whop from "@whop/sdk";

const COMPANY_ID = "biz_9lvWcOFvGki65u";
const PRODUCT_ID = "prod_BKnJYQDEf6IpH";

export async function POST(req: NextRequest) {
  try {
    // Initialize Whop client at runtime
    const whop = new Whop({
      apiKey: process.env.WHOP_API_KEY!,
    });

    const { email, serverInvite, productTitle, price } = await req.json();

    // Extract numeric price from string like "$4.99"
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));

    console.log("Creating Whop payment plan:", { productTitle, price: numericPrice, email });

    // Create a one-time payment plan dynamically with the specific price
    const plan = await whop.plans.create({
      company_id: COMPANY_ID,
      product_id: PRODUCT_ID,
      plan_type: "one_time",
      currency: "usd",
      initial_price: numericPrice,
      title: productTitle,
      description: `Discord Server Boosts - ${productTitle} | Email: ${email} | Server: ${serverInvite}`,
    });

    console.log("Whop plan created successfully:", plan.id);
    console.log("Purchase URL:", plan.purchase_url);

    return NextResponse.json({ 
      checkoutUrl: plan.purchase_url
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
