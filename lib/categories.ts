// 타입을 파일 안에서 직접 정의해서 에러를 강제로 해결합니다.
export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const NEWS_CATEGORIES: Category[] = [
  { id: "mainnet", name: "Mainnet", icon: "🌐" },
  { id: "ecosystem", name: "Ecosystem", icon: "🌱" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "community", name: "Community", icon: "👥" }
];

