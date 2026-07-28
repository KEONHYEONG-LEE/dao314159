import type { NextApiRequest, NextApiResponse } from 'next';

// 구글 번역 및 레이아웃 깨짐을 방지하고 항상 정상 작동하는 카테고리별 고정 이미지 키워드 맵
const CATEGORY_KEYWORDS: { [key: string]: string } = {
  ALL: "crypto,blockchain", MAINNET: "server,network", COMMUNITY: "people,chat",
  COMMERCE: "shopping,business", NODE: "data,cloud", MINING: "hardware,mining",
  WALLET: "wallet,money", BROWSER: "web,safari", KYC: "security,id",
  DEVELOPER: "coding,developer", ECOSYSTEM: "nature,globe", LISTING: "chart,stock",
  PRICE: "finance,coin", SECURITY: "lock,cyber", EVENT: "conference,stage",
  ROADMAP: "timeline,map", WHITEPAPER: "document,book", LEGAL: "law,court"
};

// HTML 엔티티 정제 함수 (특수문자 깨짐 방지)
function cleanHtmlEntities(str: string): string {
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>?/gm, '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "허용되지 않는 요청 메서드입니다." });
  }

  const { category = 'all' } = req.query;
  const currentCat = (category as string).toUpperCase();

  try {
    const searchQuery = currentCat === 'ALL' ? 'Pi Network crypto' : `Pi Network ${currentCat}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=en-US&gl=US&ceid=US:en`;
    
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) throw new Error("Google News Fetch Failed");

    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const googleNews = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const descRaw = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      const cleanTitle = cleanHtmlEntities(titleRaw);
      const cleanDesc = cleanHtmlEntities(descRaw).split('&nbsp;')[0].trim();
      
      const titleParts = cleanTitle.split(' - ');
      const sourceName = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const finalTitle = titleParts.join(' - ');

      const generatedId = `google-${currentCat.toLowerCase()}-${index}-${Date.now()}`;
      
      // 이미지 ID 고정 배치
      const imageId = 10 + (index % 30);
      
      // 날짜 포맷팅 (YYYY-MM-DD)
      const formattedDate = pubDate 
        ? new Date(pubDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];

      return {
        id: generatedId,
        title: finalTitle,
        url: link,
        source: sourceName,
        date: formattedDate,
        publishedAt: formattedDate, // 프론트 호환용
        category: currentCat,
        summary: cleanDesc || `${finalTitle}에 대한 자세한 내용을 확인하려면 출처 링크를 클릭하세요.`,
        content: cleanDesc || `${finalTitle}에 대한 자세한 내용을 확인하려면 출처 링크를 클릭하세요.`,
        imageUrl: `https://picsum.photos/id/${imageId}/200/200`
      };
    });

    // 실시간성 보장을 위한 캐시 헤더 설정
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(googleNews);

  } catch (error) {
    console.error("구글 RSS 뉴스 패치 실패:", error);
    
    // API 에러 시 앱이 꺼지지 않도록 예비 데이터 반환
    const fallbackNews = [
      {
        id: `fb-1-${Date.now()}`,
        title: 'Pi Network Mainnet Transition Accelerates',
        url: 'https://minepi.com',
        source: 'GPNR Tech',
        date: new Date().toISOString().split('T')[0],
        publishedAt: new Date().toISOString().split('T')[0],
        category: currentCat,
        summary: '글로벌 파이 네트워크 메인넷 전환이 가속화되며 노드 활성도가 상승하고 있습니다.',
        content: '글로벌 파이 네트워크 메인넷 전환이 가속화되며 노드 활성도가 상승하고 있습니다.',
        imageUrl: 'https://picsum.photos/id/11/200/200'
      }
    ];

    return res.status(200).json(fallbackNews);
  }
}
