import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST 요청인지 확인
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { content, lang } = req.body;
    
    // 제티가 제공해주신 Gemini API KEY
    const apiKey = "AIzaSyDTjfvDq3RADo1JWydG5r0HdmLOeeUmSeU"; 

    if (!apiKey) {
      return res.status(500).json({ summary: "API 키 설정이 필요합니다." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // 속도가 빠른 gemini-1.5-flash 모델 사용
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // AI에게 전달할 프롬프트 (3문장 요약)
    const prompt = `
      You are a smart news assistant for GPNR (Global Pi News Room). 
      Summarize the following news article within 3 concise bullet points.
      The summary MUST be written in the following language: ${lang}.
      
      Article Content:
      ${content}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ summary: text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    let errorMsg = "AI 요약 중 오류가 발생했습니다.";
    if (error.message?.includes("429")) {
      errorMsg = "현재 AI 요청이 너무 많습니다. 잠시 후 다시 시도해주세요. (무료 한도 초과)";
    }
    
    res.status(500).json({ summary: errorMsg });
  }
}
