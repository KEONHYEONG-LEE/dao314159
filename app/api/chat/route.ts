import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. 프론트엔드에서 보낸 메시지, 뉴스 정보, 선택된 언어를 받습니다.
    const { message, contextNews, lang } = await request.json();

    if (!message || !contextNews) {
      return NextResponse.json({ error: '메시지 또는 뉴스 정보가 누락되었습니다.' }, { status: 400 });
    }

    /**
     * [AI 프롬프트 설정]
     * AI에게 GPNR의 정체성과 뉴스 컨텍스트를 주입합니다.
     */
    const systemPrompt = `
      당신은 'Global Pi News Room(GPNR)'의 스마트 AI 도우미입니다.
      - 현재 사용자가 읽고 있는 뉴스 제목: "${contextNews.title}"
      - 뉴스 요약 내용: "${contextNews.description}"
      - 위 내용을 바탕으로 사용자의 질문에 답변하세요.
      - 답변 언어: 반드시 '${lang}' 언어로 답변해야 합니다.
      - 말투: 친절하고 전문적인 뉴스 분석가 톤을 유지하세요.
    `;

    // 2. [실제 AI 연동 구간] 
    // 나중에 여기에 Google Gemini나 OpenAI SDK 코드를 넣으시면 됩니다.
    // 현재는 로직 테스트를 위해 언어별 맞춤 응답 구조를 시뮬레이션합니다.

    const getSimulationResponse = (l: string) => {
      const responses: any = {
        ko: `[GPNR AI] 뉴스 "${contextNews.title}"에 대해 분석한 결과입니다. 질문하신 '${message}'에 대해 말씀드리면, 파이 네트워크의 ${contextNews.category} 분야에서 매우 중요한 전환점에 와 있다고 볼 수 있습니다.`,
        en: `[GPNR AI] Analyzing "${contextNews.title}". Regarding your question '${message}', this is a crucial turning point in the ${contextNews.category} sector of the Pi Network.`,
        zh: `[GPNR AI] 正在分析 "${contextNews.title}"。关于您提出的 '${message}' 问题，这标志着 Pi Network 在 ${contextNews.category} 领域的一个重要转折点。`,
        es: `[GPNR AI] Analizando "${contextNews.title}". En relación a su pregunta '${message}', este es un punto de inflexión crucial en el sector de ${contextNews.category} de Pi Network.`,
        vi: `[GPNR AI] Đang phân tích "${contextNews.title}". Về câu hỏi '${message}' của bạn, đây là một bước ngoặt quan trọng trong lĩnh vực ${contextNews.category} của Pi Network.`
      };
      return responses[l] || responses['en'];
    };

    const aiResponse = getSimulationResponse(lang || 'ko');

    // 3. 최종 응답 반환 (프론트엔드의 askAI 함수와 필드명을 맞춤)
    return NextResponse.json({ 
      answer: aiResponse, 
      status: 'success' 
    });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json({ error: 'AI 연결 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
