export const APP_CONFIG = {
  info: {
    name: "GPNR",
    fullName: "Global Pi Newsroom",
    version: "1.0.0",
    description: "Pi Network의 글로벌 뉴스 및 GCV 트렌드를 제공합니다.",
  },
  messages: {
    welcomeTitle: "Welcome to GPNR",
    welcomeSubtitle: "Global Pi Newsroom에 오신 것을 환영합니다.",
    loadingText: "데이터를 불러오는 중입니다...",
    errorText: "네트워크 연결 상태를 확인해 주세요.",
  },
  theme: {
    primaryColor: "#673AB7",
    secondaryColor: "#FFA000",
    backgroundColor: "#FFFFFF",
    textColor: "#212121",
  },
  api: {
    // Vercel 환경에서는 상대 경로 호출을 위해 baseUrl을 빈 문자열로 유지합니다.
    baseUrl: "", 
    timeout: 10000,
    endpoints: {
      news: "/api/fetch-news",
      gcv: "/api/gcv-trends",
      community: "/api/dao-community",
    },
  },
  categories: ["General", "GCV", "Tech", "Market", "Community", "Ecosystem", "Nodes"],
  links: {
    github: "https://github.com/KEONHYEONG-LEE/dao314159",
    domain: "https://gpnr4915.pinet.com",
    productionUrl: "https://dao314159-dusky.vercel.app",
    supportEmail: "kh1253.lee@gmail.com",
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
