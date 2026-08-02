// lib/categories.ts

export interface Category {
  id: string;
  name: string;   // 한국어 모드용 라벨
  enName: string; // 영어 모드용 라벨
  icon: string;   // Lucide Icon 명칭 또는 이모지 대응
  group: 'core' | 'ecosystem' | 'market_legal';
}

export const NEWS_CATEGORIES: Category[] = [
  // 1. 코어 네트워크 (Core Network)
  { id: "top-news", name: "주요뉴스", enName: "Top News", icon: "Flame", group: "core" }, 
  { id: "mainnet", name: "메인넷", enName: "Mainnet", icon: "Globe", group: "core" },
  { id: "node", name: "노드", enName: "Node", icon: "Tv", group: "core" },
  { id: "mining", name: "채굴", enName: "Mining", icon: "Zap", group: "core" },
  { id: "wallet", name: "지갑", enName: "Wallet", icon: "Wallet", group: "core" },
  { id: "browser", name: "브라우저", enName: "Browser", icon: "Compass", group: "core" },
  { id: "roadmap", name: "로드맵", enName: "Roadmap", icon: "Map", group: "core" },
  { id: "whitepaper", name: "백서", enName: "Whitepaper", icon: "FileText", group: "core" },

  // 2. 생태계 (Ecosystem)
  { id: "community", name: "커뮤니티", enName: "Community", icon: "Users", group: "ecosystem" },
  { id: "commerce", name: "커머스", enName: "Commerce", icon: "ShoppingCart", group: "ecosystem" },
  { id: "kyc", name: "KYC", enName: "KYC", icon: "ShieldCheck", group: "ecosystem" },
  { id: "developer", name: "개발자", enName: "Developers", icon: "Code", group: "ecosystem" },
  { id: "realestate", name: "부동산", enName: "Real Estate", icon: "Home", group: "ecosystem" },

  // 3. 마켓 및 보안 (Market & Legal)
  { id: "outlook", name: "전망시세", enName: "Price Outlook", icon: "TrendingUp", group: "market_legal" },
  { id: "price", name: "가격", enName: "Price", icon: "DollarSign", group: "market_legal" },
  { id: "security", name: "보안", enName: "Security", icon: "Shield", group: "market_legal" },
  { id: "legal", name: "관련법규", enName: "Regulations", icon: "Gavel", group: "market_legal" }
];
