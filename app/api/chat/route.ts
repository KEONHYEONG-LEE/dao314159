import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // 임시 응답 로직 (추후 실제 AI 모델 연결 가능)
    const lastMessage = messages[messages.length - 1].content;
    const aiResponse = {
      role: 'assistant',
      content: `GPNR AI 답변: "${lastMessage}"에 대해 분석 중입니다. Pi Network의 최신 정보를 확인하세요.`
    };

    return NextResponse.json(aiResponse);
  } catch (error) {
    return NextResponse.json({ error: 'Chat API Error' }, { status: 500 });
  }
}

