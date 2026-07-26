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
    // [수정] Vercel 환경에서는 baseUrl을 비워두는 것이 가장 안전합니다.
    baseUrl: "", 
    timeout: 10000,
    endpoints: {
      // [중요] 위에서 만든 파일명과 반드시 일치해야 합니다.
      news: "/api/fetch-news",
      gcv: "/api/gcv-trends",
      community: "/api/dao-community",
    },
  },
  categories: ["General", "GCV", "Tech", "Market", "Community", "Ecosystem", "Nodes"],
  links: {
    github: "https://github.com/KEONHYEONG-LEE/dao314",
    domain: "https://globalpinews4312.pinet.com",
    supportEmail: "support@e-life365.pi",
  },
};

export type AppConfig = typeof APP_CONFIG;
