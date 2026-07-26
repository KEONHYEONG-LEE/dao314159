import { NextApiRequest, NextApiResponse } from 'next';

// 1. 카테고리별 고유 이미지 ID (Picsum에서 엄선한 번호들)
const CATEGORY_IMAGE_IDS: { [key: string]: number[] } = {
  ALL: [1, 10, 16],        // 일반 뉴스/비즈니스
  MAINNET: [0, 201, 160],  // 서버/네트워크
  COMMUNITY: [129, 238, 447], // 사람들/모임
  COMMERCE: [2, 3, 4],     // 기술/커머스
  NODE: [48, 160, 532],    // 데이터센터/연결
  MINING: [180, 192, 225], // 하드웨어/칩
  WALLET: [431, 442, 555], // 금융/디지털
  BROWSER: [367, 370, 396], // 노트북/웹
  KYC: [558, 628, 984],    // 보안/신원확인
  DEVELOPER: [4, 5, 6],    // 코드/프로그래밍
  ECOSYSTEM: [10, 11, 12], // 성장/생태계
  LISTING: [20, 26, 39],   // 거래/시장
  PRICE: [513, 520, 521],  // 경제/차트
  SECURITY: [445, 529, 611], // 자물쇠/보안
  EVENT: [68, 69, 70],     // 행사/무대
  ROADMAP: [141, 142, 145], // 전략/지도
  WHITEPAPER: [24, 25, 26], // 문서/연구
  LEGAL: [175, 176, 177]   // 법률/질서
};

function cleanText(text: string) {
  if (!text) return "";
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    const searchQuery = currentCat === 'ALL' ? 'Pi Network' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(rssUrl);
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const newsData = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      let rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      rawDesc = rawDesc.replace("<![CDATA[", "").replace("]]>", "");
      
      const titleParts = titleRaw.split(' - ');
      const source = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const cleanTitle = titleParts.join(' - ');

      // 2. 해당 카테고리의 이미지 ID 풀에서 랜덤 선택
      const idPool = CATEGORY_IMAGE_IDS[currentCat] || CATEGORY_IMAGE_IDS["ALL"];
      const selectedId = idPool[index % idPool.length]; // 뉴스 순서에 따라 고르게 분배
      
      return {
        id: `news-${index}`,
        title: cleanTitle,
        content: cleanText(rawDesc),
        source: source,
        date: pubDate,
        displayDate: new Date(pubDate).toLocaleDateString('en-US'),
        url: link,
        category: currentCat,
        // 가장 안정적인 Picsum 고정 ID 방식 사용
        imageUrl: `https://picsum.photos/id/${selectedId}/400/300`
      };
    });

    const sortedNews = newsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return res.status(200).json(sortedNews.slice(0, 15));

  } catch (error) {
    return res.status(500).json({ error: "Failed to process news" });
  }
}
