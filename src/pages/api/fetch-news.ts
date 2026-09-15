import type { NextApiRequest, NextApiResponse } from 'next';

// 카테고리별 구글 뉴스 검색 쿼리 맵
const SEARCH_QUERIES: { [key: string]: string } = {
  ALL: 'Pi Network OR cryptocurrency OR Web3 news',
  MAINNET: 'Pi Network mainnet OR blockchain mainnet',
  NODE: 'Pi Network node OR blockchain node validator',
  MINING: 'Pi Network mining OR crypto mining',
  WALLET: 'Pi Network wallet OR crypto wallet security',
  COMMUNITY: 'Pi Network community OR Web3 community',
  COMMERCE: 'Pi Network payment OR crypto merchant commerce',
  BROWSER: 'Web3 browser OR Pi Network ecosystem',
  KYC: 'Pi Network KYC OR crypto identity verification',
  DEVELOPER: 'Pi Network developer OR Web3 dApp SDK',
  ECOSYSTEM: 'Pi Network ecosystem OR Web3 ecosystem',
  LISTING: 'crypto exchange listing OR Pi Network exchange',
  PRICE: 'Pi Network value OR crypto market price',
  SECURITY: 'blockchain security OR crypto regulation',
  EVENT: 'crypto conference OR Pi Network news',
  ROADMAP: 'Pi Network roadmap OR Web3 roadmap',
  WHITEPAPER: 'crypto whitepaper OR Pi Network whitepaper',
  LEGAL: 'crypto regulation OR SEC crypto lawsuit'
};

// HTML 엔티티 정제 및 태그 제거 함수
function cleanHtml(str: string): string {
  return str
    .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<[^>]*>?/gm, '')
    .trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '허용되지 않는 요청 메서드입니다.' });
  }

  const { category = 'ALL' } = req.query;
  const currentCat = (category as string).toUpperCase();

  // 요청받은 카테고리 쿼리 선정 (없으면 기본값 사용)
  const query = SEARCH_QUERIES[currentCat] || SEARCH_QUERIES['ALL'];

  try {
    // 1차 구글 뉴스 RSS 호출
    let rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    let response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    let xmlData = await response.text();
    let items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];

    // 2차 Fallback: 카테고리 검색 결과가 0건일 경우 대표 키워드('Pi Network crypto')로 재요청
    if (items.length === 0 && currentCat !== 'ALL') {
      const fallbackQuery = 'Pi Network crypto';
      rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(fallbackQuery)}&hl=en-US&gl=US&ceid=US:en`;
      response = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      xmlData = await response.text();
      items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    }

    const newsList = items.map((item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';
      const descRaw = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';

      const cleanTitleStr = cleanHtml(titleRaw);
      const cleanDescStr = cleanHtml(descRaw).split('&nbsp;')[0].trim();

      // 출처 분리 ("기사 제목 - 언론사 이름")
      const titleParts = cleanTitleStr.split(' - ');
      const sourceName = titleParts.length > 1 ? titleParts.pop() : 'Web2 News';
      const englishTitle = titleParts.join(' - ');

      const generatedId = `google-${currentCat.toLowerCase()}-${index}-${Date.now()}`;
      const imageId = (index % 30) + 10;

      // 💡 [수정 포인트 1] 날짜에서 T[0] 분할을 제거하고 원본 ISO 타임스탬프 전체 보존 (시/분/초 포함)
      let formattedDate = new Date().toISOString();
      if (pubDate) {
        const parsedTime = new Date(pubDate);
        if (!isNaN(parsedTime.getTime())) {
          formattedDate = parsedTime.toISOString();
        }
      }

      const contentText = cleanDescStr || `${englishTitle}. Read the full article on ${sourceName}.`;

      return {
        id: generatedId,
        category: currentCat,
        // 단순 문자열을 찾는 프론트엔드(전광판/Index)와 객체 형태를 찾는 컴포넌트 모두 호환
        title: englishTitle, 
        content: contentText,
        titleObj: {
          ko: englishTitle,
          en: englishTitle
        },
        contentObj: {
          ko: contentText,
          en: contentText
        },
        author: sourceName,
        sourceUrl: link,
        publishedAt: formattedDate, // ISO 8601 원본 유지 (예: 2026-07-31T08:30:00.000Z)
        imageUrl: `https://picsum.photos/id/${imageId}/600/400`,
        tags: ['Web2News', currentCat, 'Crypto'],
        readCount: Math.floor(Math.random() * 100) + 10,
        starCount: 0,
        likeCount: 0
      };
    });

    // 💡 [수정 포인트 2] 서버에서 클라이언트로 넘겨주기 전, 정확한 타임스탬프 기준 최신순(내림차순) 정렬 수행
    newsList.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Vercel Edge/Serverless 캐싱 (60초간 캐시, 120초간 백그라운드 갱신)
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(newsList);

  } catch (error) {
    console.error('Google RSS Fetch Error:', error);

    // 에러 발생 시 서번트 백업 데이터 (문자열 및 객체 호환)
    const fallbackNews = [
      {
        id: `fb-${Date.now()}`,
        category: currentCat,
        title: 'Pi Network Mainnet & Web3 Updates',
        content: 'Latest updates on Pi Network ecosystem and global Web3 trends.',
        titleObj: {
          ko: 'Pi Network Mainnet & Web3 Updates',
          en: 'Pi Network Mainnet & Web3 Updates'
        },
        contentObj: {
          ko: 'Latest updates on Pi Network ecosystem and global Web3 trends.',
          en: 'Latest updates on Pi Network ecosystem and global Web3 trends.'
        },
        author: 'GPNR Global',
        sourceUrl: 'https://minepi.com',
        publishedAt: new Date().toISOString(),
        imageUrl: 'https://picsum.photos/id/11/600/400',
        tags: ['PiNetwork', 'Web3'],
        readCount: 1,
        starCount: 0,
        likeCount: 0
      }
    ];

    return res.status(200).json(fallbackNews);
  }
}
