import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from 'next';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 보안을 위해 특정 헤더나 Cron 비밀키를 확인할 수 있습니다.
  
  try {
    // 1. 샘플 뉴스 소스 (실제 운영 시에는 더 많은 RSS나 API 연결 가능)
    // 여기서는 테스트를 위해 구글 뉴스 RSS 등을 활용하는 예시입니다.
    const response = await axios.get("https://news.google.com/rss/search?q=Pi+Network+cryptocurrency&hl=ko&gl=KR&ceid=KR:ko");
    const xmlData = response.data;

    // 2. Gemini에게 뉴스 분류 및 정제 요청
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      대상 데이터: ${xmlData.substring(0, 4000)}
      
      위 RSS 데이터에서 최신 뉴스 5개를 추출해서 다음 JSON 형식으로 응답해줘.
      카테고리는 반드시 다음 중 하나여야 함: [Mainnet, Global Community, Commerce, Social, Education, Health, Travel, Utilities, Career, Entertainment, Games, Finance, Music, Sports, DeFi, dApp, NFT]

      응답 형식:
      [
        {
          "title": "GPNR 스타일의 뉴스 제목",
          "content": "뉴스 본문 요약 (200자 내외)",
          "category": "분류된 카테고리",
          "source": "출처",
          "date": "현재 시간",
          "url": "원문 링크"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON 부분만 추출 (Gemini가 마크다운 형식을 섞을 수 있음)
    const jsonStr = responseText.match(/\[.*\]/s)?.[0];
    const newsData = jsonStr ? JSON.parse(jsonStr) : [];

    // 3. 실제 운영 시에는 여기서 데이터베이스(DB)에 저장하는 로직이 들어갑니다.
    // 지금은 결과를 바로 반환하여 확인합니다.
    res.status(200).json({ 
      message: "News fetched and categorized successfully", 
      count: newsData.length,
      data: newsData 
    });

  } catch (error) {
    console.error("Fetch News Error:", error);
    res.status(500).json({ error: "뉴스 수집 중 오류 발생" });
  }
}

