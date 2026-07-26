import { NextResponse } from 'next/server';

function cleanText(text: string) {
  return text
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]*>?/gm, '') // HTML 태그 제거
    .replace(/&[a-z0-9#]+;/gi, '') // &nbsp; 같은 엔티티 제거
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'ko';
  const category = searchParams.get('category') || 'all';

  try {
    const searchQuery = category === 'all' ? 'Pi Network' : `Pi Network ${category}`;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(searchQuery)}&hl=${lang === 'ko' ? 'ko' : 'en-US'}`;

    const response = await fetch(rssUrl, { next: { revalidate: 3600 } });
    const xmlData = await response.text();
    const items = xmlData.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    const realNews = await Promise.all(items.slice(0, 15).map(async (item, index) => {
      const titleRaw = item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
      const link = item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
      const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || "";
      const rawDesc = item.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";
      
      // 출처(Source)와 제목 분리 로직 개선
      const titleParts = titleRaw.split(' - ');
      const source = titleParts.length > 1 ? titleParts.pop() : "GPNR News";
      const title = titleParts.join(' - ');

      // 본문 정제: HTML 태그를 완전히 제거하여 텍스트만 남김
      const content = cleanText(rawDesc);

      return {
        id: `news-${index}`,
        category: category.toUpperCase(),
        title: title,
        content: content || "본문 내용을 가져올 수 없습니다.",
        source: source, // 이 값이 page.tsx의 item.source로 들어갑니다.
        date: new Date(pubDate).toLocaleDateString(),
        image: `https://picsum.photos/seed/${index}/800/600`,
        url: link
      };
    }));

    return NextResponse.json(realNews);
  } catch (error) {
    return NextResponse.json({ error: "Fail" }, { status: 500 });
  }
}
