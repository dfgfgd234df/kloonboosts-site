import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const invoiceId = searchParams.get("invoice_id");

  if (!invoiceId) {
    return NextResponse.json(
      { error: "Invoice ID is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.LTC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "LTC API key not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://api.kloonmail.online/invoice/${invoiceId}/qr`,
      {
        headers: {
          Cookie: `api_key=${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch QR code: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching QR code:", error);
    return NextResponse.json(
      { error: "Failed to fetch QR code" },
      { status: 500 }
    );
  }
}
