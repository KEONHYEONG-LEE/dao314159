import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("accessToken");

  if (!accessToken) {
    return NextResponse.json({ error: "Access token is required" }, { status: 400 });
  }

  try {
    // Pi Network 최신 Staking Data API 호출
    const response = await fetch("https://api.minepi.com/v2/ecosystem/staking/effective_stake", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Pi Staking API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // effective_stake: 파이 수량 + 동결 기간 가산점이 반영된 실효 스테이킹 값
    const effectiveStake = data.effective_stake || 0;
    
    // VIP/서포터 등급 판정 (예: 10 Pi 이상 스테이킹 시 VIP)
    const isVip = effectiveStake >= 10;

    return NextResponse.json({
      success: true,
      effectiveStake,
      isVip,
      raw: data,
    });
  } catch (error: any) {
    console.error("Staking API Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch staking data", details: error.message },
      { status: 500 }
    );
  }
}

