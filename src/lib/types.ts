/**
 * GPNR (Global Pi Newsroom) 데이터 타입 정의 파일
 * 다국어(KO/EN) 지원, 하이퍼リンク 유실 방지 및 피드백 카운팅 규격 확장
 */

export interface NewsItem {
  id: string;
  category: string;
  // 번역된 텍스트를 담을 수 있도록 구조 변경
  title: string | { ko: string; en: string }; 
  content: string | { ko: string; en: string };
  author: string;
  publishedAt: string; // 기사 작성 시간
  imageUrl?: string;
  sourceUrl: string;   // 출처 링크 (필수 항목으로 변경하여 누락 방지)
  tags: string[];
  
  // 파이오니어 피드백 누적 카운팅 필드 추가 (기존 데이터 호환을 위해 옵셔널 처리)
  readCount?: number;  // 읽음 (체크 브이) 누적 수
  starCount?: number;  // 중요 (별) 누적 수
  likeCount?: number;  // 좋음 (하트) 누적 수
}

// 나머지 UserProfile, ChatMessage 등은 기존과 동일하게 유지하셔도 됩니다.
