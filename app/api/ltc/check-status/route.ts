import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { invoice_id } = await req.json();

    const response = await fetch(
      `https://api.kloonmail.online/invoice/${invoice_id}/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `api_key=${process.env.LTC_API_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error("Failed to check invoice status");
    }

    return NextResponse.json({
      success: true,
      status: data.status,
      is_paid: data.is_paid,
      is_confirmed: data.is_confirmed,
      confirmations: data.confirmations,
      received: data.received,
      txid: data.txid,
    });
  } catch (error) {
    console.error("LTC status check error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Failed to check status" 
      },
      { status: 500 }
    );
  }
}
