// AI가 실시간으로 데이터를 채워넣을 수 있도록 형식을 유연하게 설정합니다.
export interface NewsItem {
  id: string;
  date: string;
  author: string;
  title: any;    // 여러 언어 대응을 위해 any로 설정
  content: any;
  category: string;
}

// 처음 앱을 켰을 때 에러가 나지 않도록 빈 리스트로 시작합니다.
// 나중에 AI가 이 리스트에 새로운 소식을 채워넣게 됩니다.
export const NEWS_DATA: NewsItem[] = [];

