import type { NextApiRequest, NextApiResponse } from 'next';

// 18개 표준 카테고리 슬러그(slug) 및 대문자 키 완벽 대응 쿼리 맵
const SEARCH_QUERIES: { [key: string]: string } = {
  // 슬러그 & 대문자 규격 동시 지원
  'ALL': 'Pi Network OR cryptocurrency OR Web3 news',
  'TOP-NEWS': 'Pi Network OR cryptocurrency OR Web3 news',
  'top-news': 'Pi Network OR cryptocurrency OR Web3 news',
  'MAINNET': 'Pi Network mainnet OR blockchain mainnet',
  'mainnet': 'Pi Network mainnet OR blockchain mainnet',
  'NODE': 'Pi Network node OR blockchain node validator',
  'node': 'Pi Network node OR blockchain node validator',
  'MINING': 'Pi Network mining OR crypto mining',
  'mining': 'Pi Network mining OR crypto mining',
  'WALLET': 'Pi Network wallet OR crypto wallet security',
  'wallet': 'Pi Network wallet OR crypto wallet security',
  'COMMUNITY': 'Pi Network community OR Web3 community',
  'community': 'Pi Network community OR Web3 community',
  'COMMERCE': 'Pi Network payment OR crypto merchant commerce',
  'commerce': 'Pi Network payment OR crypto merchant commerce',
  'BROWSER': 'Web3 browser OR Pi Network ecosystem',
  'browser': 'Web3 browser OR Pi Network ecosystem',
  'KYC': 'Pi Network KYC OR crypto identity verification',
  'kyc': 'Pi Network KYC OR crypto identity verification',
  'DEVELOPER': 'Pi Network developer OR Web3 dApp SDK',
  'developer': 'Pi Network developer OR Web3 dApp SDK',
  'ECOSYSTEM': 'Pi Network ecosystem OR Web3 ecosystem',
  'ecosystem': 'Pi Network ecosystem OR Web3 ecosystem',
  'LISTING': 'crypto exchange listing OR Pi Network exchange',
  'listing': 'crypto exchange listing OR Pi Network exchange',
  'PRICE': 'Pi Network value OR crypto market price',
  'price': 'Pi Network value OR crypto market price',
  'SECURITY': 'blockchain security OR crypto regulation',
  'security': 'blockchain security OR crypto regulation',
  'EVENT': 'crypto conference OR Pi Network news',
  'event': 'crypto conference OR Pi Network news',
  'ROADMAP': 'Pi Network roadmap OR Web3 roadmap',
  'roadmap': 'Pi Network roadmap OR Web3 roadmap',
  'WHITEPAPER': 'crypto whitepaper OR Pi Network whitepaper',
  'whitepaper': 'crypto whitepaper OR Pi Network whitepaper',
  'LEGAL': 'crypto regulation OR SEC crypto lawsuit',
  'legal': 'crypto regulation OR SEC crypto lawsuit',
};

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

  const { category = 'top-news' } = req.query;
  const rawCat = String(category).trim();
  
  // 카테고리 매핑 (소문자/대문자 모두 검색)
  const query = SEARCH_QUERIES[rawCat] || SEARCH_QUERIES[rawCat.toUpperCase()] || SEARCH_QUERIES['ALL'];

  try {
    let rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    
    let response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    let xmlData = await response.text();
    let items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];

    // Fallback: 쿼리 결과가 없을 경우 기본 검색어로 재시도
    if (items.length === 0 && rawCat !== 'ALL' && rawCat !== 'top-news') {
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

      const titleParts = cleanTitleStr.split(' - ');
      const sourceName = titleParts.length > 1 ? titleParts.pop() : 'Web2 News';
      const englishTitle = titleParts.join(' - ');

      const generatedId = `google-${rawCat}-${index}-${Date.now()}`;
      const imageId = (index % 30) + 10;

      let formattedDate = new Date().toISOString();
      if (pubDate) {
        const parsedTime = new Date(pubDate);
        if (!isNaN(parsedTime.getTime())) {
          formattedDate = parsedTime.toISOString();
        }
      }

      const contentText = cleanDescStr || `${englishTitle}. Read full article on ${sourceName}.`;

      return {
        id: generatedId,
        category: rawCat,
        // 프론트엔드 getParsedText 호환 구조 ({ ko, en } 객체 형태 지원)
        title: {
          ko: englishTitle,
          en: englishTitle
        },
        content: {
          ko: contentText,
          en: contentText
        },
        author: sourceName,
        source: sourceName,
        sourceUrl: link,
        url: link,
        publishedAt: formattedDate,
        date: formattedDate,
        imageUrl: `https://picsum.photos/id/${imageId}/600/400`,
        image: `https://picsum.photos/id/${imageId}/600/400`
      };
    });

    newsList.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json(newsList);

  } catch (error) {
    console.error('Google RSS Fetch Error:', error);

    const fallbackNews = [
      {
        id: `fb-${Date.now()}`,
        category: rawCat,
        title: {
          ko: 'Pi Network Mainnet & Web3 Updates',
          en: 'Pi Network Mainnet & Web3 Updates'
        },
        content: {
          ko: 'Latest updates on Pi Network ecosystem and global Web3 trends.',
          en: 'Latest updates on Pi Network ecosystem and global Web3 trends.'
        },
        author: 'GPNR Global',
        sourceUrl: 'https://minepi.com',
        url: 'https://minepi.com',
        publishedAt: new Date().toISOString(),
        imageUrl: 'https://picsum.photos/id/11/600/400'
      }
    ];

    return res.status(200).json(fallbackNews);
  }
}
