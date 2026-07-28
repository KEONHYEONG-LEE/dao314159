import { NewsItem } from "./types";

// API 연동 실패 시 보여줄 최소한의 기본 백업 데이터 (Fallback Data)
export const FALLBACK_NEWS_DATA: NewsItem[] = [
  {
    id: "fallback-1",
    category: "MAINNET",
    title: { 
      ko: "파이 네트워크 메인넷 전환 가속화: 노드 활성도 역대 최고치 기록", 
      en: "Pi Network Mainnet Transition Accelerates: Node Activity Reaches Record High" 
    },
    author: "블록코노미",
    publishedAt: new Date().toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800",
    sourceUrl: "https://minepi.com",
    tags: ["PiNetwork", "Mainnet", "Crypto"],
    content: {
      ko: "파이 네트워크 생태계의 메인넷 마이그레이션이 가속화되고 있습니다.",
      en: "Pi Network ecosystem mainnet migration is accelerating."
    },
    readCount: 0,
    starCount: 0,
    likeCount: 0
  }
];

/**
 * 실시간 뉴스를 API(/api/fetch-news)로부터 가져오는 함수
 */
export async function getLatestNews(): Promise<NewsItem[]> {
  try {
    // 캐싱을 방지(no-store)하여 호출할 때마다 항상 최신 뉴스를 받아옵니다.
    const baseUrl = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
    const response = await fetch(`${baseUrl}/api/fetch-news`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    
    return FALLBACK_NEWS_DATA;
  } catch (error) {
    console.error("News Fetch Error:", error);
    // API 호출 실패 시 백업 데이터를 반환하여 화면 끊김을 방지합니다.
    return FALLBACK_NEWS_DATA;
  }
}
