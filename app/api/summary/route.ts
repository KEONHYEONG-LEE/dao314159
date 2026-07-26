import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { content, lang } = await request.json();
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ summary: "Gemini API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    // Gemini 설정
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // 무료이면서 아주 빠른 모델

    const prompt = `다음 뉴스 기사를 ${lang === 'ko' ? '한국어' : '영어'}로 3문장 이내의 핵심 포인트만 요약해줘:\n\n${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ summary: "AI 요약 중 오류가 발생했습니다. (무료 한도 초과 등)" });
  }
}
