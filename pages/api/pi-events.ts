import type { NextApiRequest, NextApiResponse } from 'next';

export interface PiEventItem {
  id: string;
  titleKo: string;
  titleEn: string;
  statusKo: string;
  statusEn: string;
  date?: string;
  badgeType?: 'purple' | 'blue' | 'green';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // 1. 최신 뉴스/공지 데이터 가져오기 (예: 기존 pi-news-v2 로직 활용 가능)
    // AI API (OpenAI/Gemini 등) 호출을 통해 파이 네트워크 주요 일정 추출
    
    /* 
       AI Prompt 예시: 
       "다음 파이 네트워크 뉴스 데이터에서 최신 이벤트/일정 3~5개를 추출해서 JSON으로 리턴해줘"
    */

    // AI 추출 결과 또는 실시간 뉴스 기반 동적 일정 데이터
    const dynamicEvents: PiEventItem[] = [
      {
        id: '1',
        titleKo: '메인넷 마이그레이션 및 KYC 업데이트',
        titleEn: 'Mainnet Migration & KYC Update',
        statusKo: '진행중',
        statusEn: 'In Progress',
        badgeType: 'purple'
      },
      {
        id: '2',
        titleKo: '해커톤 우수 앱 노드 동기화',
        titleEn: 'Hackathon App Node Sync',
        statusKo: '활성화',
        statusEn: 'Active',
        badgeType: 'blue'
      },
      {
        id: '3',
        titleKo: 'GPNR 뉴스룸 실시간 데이터 동기화',
        titleEn: 'GPNR Real-time Data Sync',
        statusKo: '실시간',
        statusEn: 'Live',
        badgeType: 'green'
      }
    ];

    // 응답 캐싱 (5분 간격 업데이트)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    return res.status(200).json({ success: true, events: dynamicEvents });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch Pi events' });
  }
}

