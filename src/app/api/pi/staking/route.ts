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

    // 외부 API가 200 OK가 아닌 경우 (404, 401 등)
    if (!response.ok) {
      console.warn(`Pi Staking API warning (${response.status}): ${response.statusText}`);
      
      // 404 등 데이터나 엔드포인트가 없는 경우 500을 터뜨리지 않고 
      // 스테이킹 기본값(0)을 반환하거나 외부 상태 코드를 전달합니다.
      return NextResponse.json({
        success: false,
        effectiveStake: 0,
        isVip: false,
        message: `Pi API responded with status ${response.status}`,
      }, { status: 200 }); // 클라이언트 앱이 튕기지 않도록 200 처리 또는 response.status
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
    // 네트워크 연결 자체의 문제 등 실제 서버 내부 에러만 catch로 처리
    console.error("Staking API Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch staking data", details: error.message },
      { status: 500 }
    );
  }
}
