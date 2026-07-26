import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { accessToken, user } = await req.json();
    // 여기서 Pi Network SDK를 통해 토큰 검증을 진행합니다.
    return NextResponse.json({ authenticated: true, user });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

