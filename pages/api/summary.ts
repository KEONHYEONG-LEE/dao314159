import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from 'next';

// 환경 변수에서 키를 불러옵니다.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST 방식만 허용
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { content, lang } = req.body;

  if (!content) {
    return res.status(400).json({ summary: "요약할 내용이 없습니다." });
  }

  try {
    // Gemini 1.5 Flash 모델 설정
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 언어에 따른 프롬프트 자동 설정
    const prompt = `
      대상: 아래 뉴스 기사 본문
      언어: ${lang === 'en' ? 'English' : lang === 'zh' ? 'Chinese' : lang === 'vi' ? 'Vietnamese' : 'Korean'}
      요청사항:
      1. 핵심 내용을 3줄 이내로 명확하게 요약할 것.
      2. 반드시 요청받은 언어로 답변할 것.
      3. Pi Network 커뮤니티에 도움이 될 만한 관점으로 작성할 것.
      
      기사 본문: ${content.substring(0, 3000)}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ summary: text });
  } catch (error) {
    console.error("Gemini API 에러:", error);
    res.status(500).json({ summary: "AI가 잠시 휴식 중입니다. 다시 시도해 주세요!" });
  }
}

