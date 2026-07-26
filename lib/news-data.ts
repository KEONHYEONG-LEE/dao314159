export interface NewsItem {
  id: string;
  date: string;
  author: string;
  title: string;      // 객체에서 단일 문자열(영어)로 변경
  content: string;    // 객체에서 단일 문자열(영어)로 변경
  category: string;
  imageUrl?: string;
  source?: string;
  url?: string;
}

// 1. HTML 태그 내에서 첫 번째 이미지 URL을 추출하는 함수
const extractImageUrl = (content: string): string | undefined => {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : undefined;
};

// 2. HTML 태그 및 특수문자를 제거하여 깔끔한 텍스트로 만드는 함수
const cleanText = (html: string): string => {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "") // 태그 제거
    .replace(/&nbsp;/g, " ")    // 공백 처리
    .replace(/&amp;/g, "&")     // 특수문자 처리
    .trim();
};

// 3. 영어 전용 데이터 구조로 초기화
export const NEWS_DATA: NewsItem[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    author: "GPNR Reporter",
    title: "Pi Network Mainnet Upgrade to Protocol 22",
    content: "Critical Deadline for Node Operators Approaches. Ensure your software is updated to the latest version to maintain network stability.",
    category: "MAINNET",
    imageUrl: "https://example.com/pi-image.jpg", 
    source: "MEXC",
    url: "https://news.google.com/..."
  }
];
