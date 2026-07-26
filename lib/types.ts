
/**
 * GPNR (Global Pi Newsroom) 데이터 타입 정의 파일
 * 앱 전반에서 사용하는 정보들의 '규격(Label)'을 정의합니다.
 */

// 1. 뉴스 및 카테고리 정보 (17개 카테고리 대응)
export interface NewsItem {
  id: string;
  category: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  sourceUrl?: string;
  tags: string[];
}

// 2. 사용자 인증 및 프로필 (Web3 지갑 연결 고려)
export interface UserProfile {
  uid: string;
  username: string;
  walletAddress?: string; // Pi Wallet 주소
  email?: string;
  avatarUrl?: string;
  role: 'admin' | 'editor' | 'member'; // 사용자 권한
  createdAt: number;
}

// 3. 채팅 및 메시지 데이터 (Global Newsroom 소통용)
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  type: 'text' | 'image' | 'link';
}

// 4. 결제 및 트랜잭션 데이터 (Pi Network 연동 대비)
export interface PaymentData {
  transactionId: string;
  amount: number;
  currency: 'Pi' | 'USD';
  status: 'pending' | 'completed' | 'failed';
  memo?: string;
  timestamp: number;
}

// 5. API 응답 표준 규격
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error?: string;
  message?: string;
}

// 6. GCV(Global Consensus Value) 트렌드 데이터
export interface GcvTrend {
  region: string;
  consensusPrice: number;
  currency: string;
  lastUpdated: string;
}
