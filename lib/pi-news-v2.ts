import { NewsItem } from './types';

export const FALLBACK_NEWS_DATA: Record<string, NewsItem[]> = {
  'top-news': [
    {
      id: 'fb-top-1',
      title: 'Pi Network, 프로토콜 21 업그레이드 발표 및 노드 업데이트 마감일 4월 6일로 설정',
      description: 'Pi Network 코어팀이 프로토콜 21 업그레이드 일정을 발표했습니다. 모든 노드 운영자는 4월 6일까지 업그레이드를 완료해야 합니다.',
      url: 'https://coingape.com',
      source: '코인게이프',
      category: 'top-news',
      publishedAt: '2026-03-30T09:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'fb-top-2',
      title: '2026년 파이 데이를 축하합니다: 개척자와 개발자를 지원하는 주요 기능 및 생태계 릴리스',
      description: '2026년 파이 데이를 맞이하여 Pi Network가 새로운 앱 개발자 도구와 생태계 업데이트를 공개했습니다.',
      url: 'https://minepi.com',
      source: '파이 네트워크',
      category: 'top-news',
      publishedAt: '2026-03-14T00:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'fb-top-3',
      title: 'Pi Network 뉴스: 핵심 팀, 메인넷 노드 업그레이드 마감일을 2월 15일로 설정',
      description: '메인넷 전환 준비를 위한 노드 버전 업데이트가 진행 중입니다.',
      url: 'https://coinpedia.org',
      source: '코인피디아 핀테크 뉴스',
      category: 'top-news',
      publishedAt: '2026-02-12T12:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'fb-top-4',
      title: 'Pi Network의 최근 업그레이드 추진 뒤에 숨겨진 진짜 위험은 무엇일까요?',
      description: '네트워크 보안 강화와 생태계 확장을 위한 주요 노드 업그레이드의 중요성 분석.',
      url: 'https://cointribune.com',
      source: '코인트리뷴',
      category: 'top-news',
      publishedAt: '2026-06-21T08:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 'fb-top-5',
      title: 'Pi Network, 노드 운영자에게 경고: 지금 업그레이드하지 않으면 네트워크 연결이 끊어집니다',
      description: '최신 버전 미적용 노드에 대한 자동 접속 제한 조치가 시행될 예정입니다.',
      url: 'https://tradingview.com',
      source: '트레이딩뷰',
      category: 'top-news',
      publishedAt: '2026-06-19T10:00:00Z',
      imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60'
    }
  ]
};

// ---------------------------------------------------------------------------
// 🚨 핵심 수정 로직
// ---------------------------------------------------------------------------
// 카테고리별 뉴스를 불러온 후 최신순(내림차순)으로 정렬하여 반환하는 함수
export function getFallbackNews(category: string): NewsItem[] {
  const news = FALLBACK_NEWS_DATA[category] || FALLBACK_NEWS_DATA['top-news'] || [];

  // publishedAt 날짜 기준 내림차순(최신순) 정렬
  return [...news].sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return timeB - timeA; // 최신 날짜가 위로 오도록 정렬
  });
}
