import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount_usd, description } = await req.json();

    console.log("Creating LTC invoice for:", { amount_usd, description });

    const response = await fetch("https://api.kloonmail.online/invoice/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `api_key=${process.env.LTC_API_KEY}`,
      },
      body: JSON.stringify({
        amount_usd: parseFloat(amount_usd),
        description: description,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to create LTC invoice");
    }

    console.log("LTC Invoice created:", data);

    return NextResponse.json({
      success: true,
      invoice_id: data.invoice_id,
      address: data.address,
      amount_ltc: data.amount_ltc,
      network_fee: data.network_fee,
      total_ltc: data.total_ltc,
    });
  } catch (error) {
    console.error("LTC invoice creation error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : "Failed to create LTC invoice" 
      },
      { status: 500 }
    );
  }
}
