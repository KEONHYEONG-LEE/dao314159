/**
 * GPNR (Global Pi Newsroom) 글로벌 설정 파일
 * 앱의 이름, 메시지, 테마 색상 및 API 경로를 관리합니다.
 */

export const APP_CONFIG = {
  // 1. 기본 앱 정보
  info: {
    name: "GPNR",
    fullName: "Global Pi Newsroom",
    version: "1.0.0",
    description: "Pi Network의 글로벌 뉴스 및 GCV 트렌드를 17개 카테고리로 제공합니다.",
  },

  // 2. 환영 메시지 및 UI 텍스트
  messages: {
    welcomeTitle: "Welcome to GPNR",
    welcomeSubtitle: "Global Pi Newsroom에 오신 것을 환영합니다.",
    loadingText: "데이터를 불러오는 중입니다...",
    errorText: "네트워크 연결 상태를 확인해 주세요.",
  },

  // 3. 테마 및 디자인 설정 (Pi Network의 상징적인 색상 반영)
  theme: {
    primaryColor: "#673AB7", // Pi Purple
    secondaryColor: "#FFA000", // Pi Gold
    backgroundColor: "#FFFFFF",
    textColor: "#212121",
  },

  // 4. 서버 및 API 연결 설정 (Vercel 배포 환경 고려)
  api: {
    // 환경 변수가 없을 경우 로컬 주소를 기본값으로 사용
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://dao314.pi",
    timeout: 5000, // 5초
    endpoints: {
      news: "/api/news",
      gcv: "/api/gcv-trends",
      community: "/api/dao-community",
    },
  },

  // 5. 뉴스 카테고리 설정 (17개 카테고리 확장성 대비)
  categories: [
    "General",
    "GCV",
    "Tech",
    "Market",
    "Community",
    "Ecosystem",
    "Nodes",
    // ...필요에 따라 추가 가능
  ],

  // 6. 소셜 및 외부 링크
  links: {
    github: "https://github.com/KEONHYEONG-LEE/dao314",
    domain: "https://dao314.pi",
    supportEmail: "support@e-life365.pi",
  },
};

export type AppConfig = typeof APP_CONFIG;
