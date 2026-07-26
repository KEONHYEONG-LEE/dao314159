// lib/categories.ts

export interface Category {
  id: string;
  name: string;   // 한국어 모드용 라벨
  enName: string; // 영어 모드용 라벨 (추가)
  icon: string;
  group: 'core' | 'ecosystem' | 'market_legal'; // 사용하지 않는 utility 그룹 배제
}

export const NEWS_CATEGORIES: Category[] = [
  // 1. 코어 네트워크 (Core Network)
  { id: "all", name: "주요뉴스", enName: "Top News", icon: "🔥", group: "core" }, 
  { id: "mainnet", name: "메인넷", enName: "Mainnet", icon: "🌐", group: "core" },
  { id: "node", name: "노드", enName: "Node", icon: "🖥️", group: "core" },
  { id: "mining", name: "채굴", enName: "Mining", icon: "⚡", group: "core" },
  { id: "wallet", name: "지갑", enName: "Wallet", icon: "👛", group: "core" },
  { id: "browser", name: "브라우저", enName: "Browser", icon: "🧭", group: "core" },
  { id: "roadmap", name: "로드맵", enName: "Roadmap", icon: "🎯", group: "core" },
  { id: "whitepaper", name: "백서", enName: "Whitepaper", icon: "📜", group: "core" },

  // 2. 생태계 (Ecosystem)
  { id: "community", name: "커뮤니티", enName: "Community", icon: "👥", group: "ecosystem" },
  { id: "commerce", name: "커머스", enName: "Commerce", icon: "🛒", group: "ecosystem" },
  { id: "kyc", name: "KYC", enName: "KYC", icon: "🆔", group: "ecosystem" },
  { id: "developer", name: "개발자", enName: "Developers", icon: "👨‍💻", group: "ecosystem" },
  { id: "ecosystem", name: "부동산", enName: "Real Estate", icon: "🌱", group: "ecosystem" }, // [통일] UI 일관성을 위해 부동산으로 매핑 고정

  // 3. 마켓 및 보안 (Market & Legal)
  { id: "outlook", name: "전망시세", enName: "Price Outlook", icon: "📊", group: "market_legal" },
  { id: "price", name: "가격", enName: "Price", icon: "🪙", group: "market_legal" },
  { id: "security", name: "보안", enName: "Security", icon: "🛡️", group: "market_legal" },
  { id: "legal", name: "관련법규", enName: "Regulations", icon: "⚖️", group: "market_legal" }
];
