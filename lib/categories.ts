import React from 'react';
import {
  Flame,
  Globe,
  Tv,
  Zap,
  Wallet,
  Compass,
  Map,
  FileText,
  Users,
  ShoppingCart,
  ShieldCheck,
  Code,
  Home,
  TrendingUp,
  DollarSign,
  Shield,
  Gavel,
  type LucideIcon
} from "lucide-react";

export interface Category {
  id: string;
  name: string;      // 한국어 모드용 라벨
  enName: string;    // 영어 모드용 라벨
  label?: string;    // GpnrHeader 호환용
  enLabel?: string;  // GpnrHeader 호환용
  iconName: string;  // 문자열 명칭
  Icon: LucideIcon;  // Lucide 아이콘 컴포넌트 객체
  group: 'core' | 'ecosystem' | 'market_legal';
}

export const NEWS_CATEGORIES: Category[] = [
  // 1. 코어 네트워크 (Core Network)
  { id: "top-news", name: "주요뉴스", label: "주요뉴스", enName: "Top News", enLabel: "Top News", iconName: "Flame", Icon: Flame, group: "core" }, 
  { id: "mainnet", name: "메인넷", label: "메인넷", enName: "Mainnet", enLabel: "Mainnet", iconName: "Globe", Icon: Globe, group: "core" },
  { id: "node", name: "노드", label: "노드", enName: "Node", enLabel: "Node", iconName: "Tv", Icon: Tv, group: "core" },
  { id: "mining", name: "채굴", label: "채굴", enName: "Mining", enLabel: "Mining", iconName: "Zap", Icon: Zap, group: "core" },
  { id: "wallet", name: "지갑", label: "지갑", enName: "Wallet", enLabel: "Wallet", iconName: "Wallet", Icon: Wallet, group: "core" },
  { id: "browser", name: "브라우저", label: "브라우저", enName: "Browser", enLabel: "Browser", iconName: "Compass", Icon: Compass, group: "core" },
  { id: "roadmap", name: "로드맵", label: "로드맵", enName: "Roadmap", enLabel: "Roadmap", iconName: "Map", Icon: Map, group: "core" },
  { id: "whitepaper", name: "백서", label: "백서", enName: "Whitepaper", enLabel: "Whitepaper", iconName: "FileText", Icon: FileText, group: "core" },

  // 2. 생태계 (Ecosystem)
  { id: "community", name: "커뮤니티", label: "커뮤니티", enName: "Community", enLabel: "Community", iconName: "Users", Icon: Users, group: "ecosystem" },
  { id: "commerce", name: "커머스", label: "커머스", enName: "Commerce", enLabel: "Commerce", iconName: "ShoppingCart", Icon: ShoppingCart, group: "ecosystem" },
  { id: "kyc", name: "KYC", label: "KYC", enName: "KYC", enLabel: "KYC", iconName: "ShieldCheck", Icon: ShieldCheck, group: "ecosystem" },
  { id: "developer", name: "개발자", label: "개발자", enName: "Developers", enLabel: "Developers", iconName: "Code", Icon: Code, group: "ecosystem" },
  { id: "ecosystem", name: "부동산", label: "부동산", enName: "Real Estate", enLabel: "Real Estate", iconName: "Home", Icon: Home, group: "ecosystem" },

  // 3. 마켓 및 보안 (Market & Legal)
  { id: "outlook", name: "전망시세", label: "전망시세", enName: "Price Outlook", enLabel: "Price Outlook", iconName: "TrendingUp", Icon: TrendingUp, group: "market_legal" },
  { id: "price", name: "가격", label: "가격", enName: "Price", enLabel: "Price", iconName: "DollarSign", Icon: DollarSign, group: "market_legal" },
  { id: "security", name: "보안", label: "보안", enName: "Security", enLabel: "Security", iconName: "Shield", Icon: Shield, group: "market_legal" },
  { id: "legal", name: "관련법규", label: "관련법규", enName: "Regulations", enLabel: "Regulations", iconName: "Gavel", Icon: Gavel, group: "market_legal" }
];

export default NEWS_CATEGORIES;
