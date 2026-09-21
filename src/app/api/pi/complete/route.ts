import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. 요청 Body 파싱 안전 처리
    const body = await req.json().catch(() => null);
    if (!body || !body.paymentId || !body.txid) {
      return NextResponse.json(
        { error: "Payment ID and Transaction ID (txid) are required" },
        { status: 400 }
      );
    }

    const { paymentId, txid } = body;

    const PI_API_KEY = process.env.PI_API_KEY;
    if (!PI_API_KEY) {
      console.error("PI_API_KEY is not configured in environment variables.");
      return NextResponse.json({ error: "Pi API Key missing" }, { status: 500 });
    }

    // 2. 파이 플랫폼 서버로 Payment Complete 요청 (txid 전송)
    const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txid }),
    });

    // 3. 외부 API 응답 데이터 안전 파싱 (JSON이 아닌 경우 대비)
    const responseData = await response.json().catch(() => ({ message: "Failed to parse Pi API response" }));

    if (!response.ok) {
      console.warn(`Pi Complete API failed (${response.status}):`, responseData);
      return NextResponse.json(
        { success: false, error: responseData },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: responseData });
  } catch (error: any) {
    console.error("Payment Complete Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
