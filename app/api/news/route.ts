
import { NextResponse } from 'next/server';

export async function GET() {
  // 실제 DB나 외부 뉴스 피드 연결 전 샘플 데이터
  const mockNews = [
    { id: '1', title: 'Pi Network 메인넷 업데이트 소식', category: 'General', date: '2026-04-01' },
    { id: '2', title: 'GPNR 17개 뉴스 카테고리 분류 완료', category: 'Announcement', date: '2026-04-01' }
  ];

  return NextResponse.json(mockNews);
}
